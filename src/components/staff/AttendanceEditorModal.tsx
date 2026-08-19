import React, { useState } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { AttendanceRecord, AttendanceBreak, AttendanceStatus, StaffUser } from '../../types';
import { 
  X, 
  Clock, 
  Calendar, 
  Coffee, 
  User, 
  ShieldCheck, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2,
  FileText
} from 'lucide-react';

interface AttendanceEditorModalProps {
  record?: AttendanceRecord | null;
  onClose: () => void;
  defaultDate?: string;
  defaultUserId?: string;
}

export const AttendanceEditorModal: React.FC<AttendanceEditorModalProps> = ({
  record,
  onClose,
  defaultDate,
  defaultUserId
}) => {
  const { 
    currentUser, 
    staffList, 
    addAttendanceRecord, 
    updateAttendanceRecord 
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const isEditing = !!record;

  // Selected employee
  const [selectedStaffId, setSelectedStaffId] = useState<string>(() => {
    if (record) return record.userId;
    if (defaultUserId) return defaultUserId;
    // For admins adding, default to first non-admin/employee or first staff
    const firstOther = staffList.find(s => s.id !== currentUser?.id);
    return firstOther ? firstOther.id : staffList[0]?.id || '';
  });

  const [date, setDate] = useState<string>(() => {
    if (record) return record.date;
    if (defaultDate) return defaultDate;
    return new Date().toISOString().split('T')[0];
  });

  // Clock in & out times (formatted as HH:mm in local time or extracted from ISO)
  const formatIsoToTimeInput = (isoStr?: string): string => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '';
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch {
      return '';
    }
  };

  const [clockInTime, setClockInTime] = useState<string>(() => formatIsoToTimeInput(record?.clockIn));
  const [clockOutTime, setClockOutTime] = useState<string>(() => formatIsoToTimeInput(record?.clockOut));
  const [status, setStatus] = useState<AttendanceStatus>(() => record?.status || 'present');
  const [notes, setNotes] = useState<string>(() => record?.notes || '');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Breaks management (Max 2 breaks)
  interface BreakState {
    id: string;
    breakNumber: 1 | 2;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    note: string;
  }

  const [breaks, setBreaks] = useState<BreakState[]>(() => {
    if (record && record.breaks && record.breaks.length > 0) {
      return record.breaks.slice(0, 2).map((b, idx) => ({
        id: b.id || `brk-${idx + 1}`,
        breakNumber: (idx + 1) as 1 | 2,
        startTime: formatIsoToTimeInput(b.startTime),
        endTime: formatIsoToTimeInput(b.endTime),
        note: b.note || (idx === 0 ? 'Meal / Lunch Break' : 'Tea / Coffee Break')
      }));
    }
    return [];
  });

  const selectedStaff = staffList.find(s => s.id === selectedStaffId);

  // Helper to convert date + time input string to ISO
  const timeInputToIso = (dateStr: string, timeStr: string): string | undefined => {
    if (!timeStr) return undefined;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return undefined;
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const handleAddBreak = () => {
    if (breaks.length >= 2) {
      setErrorMessage('A maximum of 2 breaks are permitted per shift.');
      return;
    }
    setErrorMessage(null);
    const nextNum = (breaks.length + 1) as 1 | 2;
    setBreaks(prev => [
      ...prev,
      {
        id: `brk-${Date.now()}`,
        breakNumber: nextNum,
        startTime: nextNum === 1 ? '13:00' : '16:00',
        endTime: nextNum === 1 ? '13:45' : '16:15',
        note: nextNum === 1 ? 'Meal / Lunch Break' : 'Tea / Coffee Break'
      }
    ]);
  };

  const handleRemoveBreak = (index: number) => {
    setBreaks(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((b, idx) => ({
        ...b,
        breakNumber: (idx + 1) as 1 | 2
      }));
    });
  };

  const handleBreakChange = (index: number, field: keyof BreakState, value: string) => {
    setBreaks(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  // Live calculation of work and break durations
  const calculateDurations = () => {
    let totalWorkMinutes = 0;
    if (clockInTime && clockOutTime) {
      const [inH, inM] = clockInTime.split(':').map(Number);
      const [outH, outM] = clockOutTime.split(':').map(Number);
      const inMins = inH * 60 + inM;
      const outMins = outH * 60 + outM;
      if (outMins >= inMins) {
        totalWorkMinutes = outMins - inMins;
      }
    }

    let totalBreakMinutes = 0;
    breaks.forEach(b => {
      if (b.startTime && b.endTime) {
        const [sH, sM] = b.startTime.split(':').map(Number);
        const [eH, eM] = b.endTime.split(':').map(Number);
        const sMins = sH * 60 + sM;
        const eMins = eH * 60 + eM;
        if (eMins >= sMins) {
          totalBreakMinutes += (eMins - sMins);
        }
      }
    });

    const netWorkMinutes = Math.max(0, totalWorkMinutes - totalBreakMinutes);

    return { totalWorkMinutes, totalBreakMinutes, netWorkMinutes };
  };

  const { totalWorkMinutes, totalBreakMinutes, netWorkMinutes } = calculateDurations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedStaff) {
      setErrorMessage('Please select a valid staff member.');
      return;
    }

    if (!date) {
      setErrorMessage('Please specify an attendance date.');
      return;
    }

    // Strict validation: Admins cannot edit their own attendance
    if (!isSuperadmin && currentUser?.role === 'admin') {
      const isSelf = selectedStaff.id === currentUser.id || selectedStaff.email.toLowerCase() === currentUser.email.toLowerCase();
      if (isSelf) {
        setErrorMessage('Security Constraint: Admins are strictly prohibited from editing or manually logging their own attendance.');
        return;
      }
    }

    if (breaks.length > 2) {
      setErrorMessage('Maximum of 2 breaks allowed.');
      return;
    }

    setIsSubmitting(true);

    const clockInIso = clockInTime ? timeInputToIso(date, clockInTime) : undefined;
    const clockOutIso = clockOutTime ? timeInputToIso(date, clockOutTime) : undefined;

    const formattedBreaks: AttendanceBreak[] = breaks.map((b, idx) => {
      const startIso = b.startTime ? timeInputToIso(date, b.startTime) || '' : '';
      const endIso = b.endTime ? timeInputToIso(date, b.endTime) : undefined;
      
      let dur = 0;
      if (b.startTime && b.endTime) {
        const [sH, sM] = b.startTime.split(':').map(Number);
        const [eH, eM] = b.endTime.split(':').map(Number);
        if ((eH * 60 + eM) >= (sH * 60 + sM)) {
          dur = (eH * 60 + eM) - (sH * 60 + sM);
        }
      }

      return {
        id: b.id,
        breakNumber: (idx + 1) as 1 | 2,
        startTime: startIso,
        endTime: endIso,
        durationMinutes: dur,
        note: b.note || (idx === 0 ? 'Meal / Lunch Break' : 'Tea / Coffee Break')
      };
    });

    if (isEditing && record) {
      const res = updateAttendanceRecord(
        record.id,
        {
          clockIn: clockInIso,
          clockOut: clockOutIso,
          breaks: formattedBreaks,
          status,
          notes: notes.trim(),
          totalWorkMinutes,
          totalBreakMinutes,
          netWorkMinutes
        },
        adjustmentReason.trim() || 'Manual adjustment via Attendance Editor'
      );

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update attendance record.');
        setIsSubmitting(false);
        return;
      }
    } else {
      const res = addAttendanceRecord({
        userId: selectedStaff.id,
        userName: selectedStaff.name,
        userEmail: selectedStaff.email.toLowerCase(),
        userRole: selectedStaff.role,
        userAvatar: selectedStaff.avatar,
        userTitle: selectedStaff.title,
        date,
        clockIn: clockInIso,
        clockOut: clockOutIso,
        breaks: formattedBreaks,
        totalWorkMinutes,
        totalBreakMinutes,
        netWorkMinutes,
        status,
        notes: notes.trim()
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create attendance record.');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif">
                {isEditing ? 'Edit Attendance Record' : 'Record Manual Attendance'}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                {isSuperadmin ? (
                  <span className="inline-flex items-center gap-1 text-purple-400 font-semibold">
                    <Crown className="w-3.5 h-3.5" />
                    Superadmin Full Override
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Staff Management
                  </span>
                )}
                <span>•</span>
                <span>Max 2 Breaks Policy Enforced</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Employee & Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Member / Employee <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                disabled={isEditing}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
              >
                {staffList.map((s) => {
                  const isSelf = s.id === currentUser?.id || s.email.toLowerCase() === currentUser?.email.toLowerCase();
                  const isDisabled = !isSuperadmin && currentUser?.role === 'admin' && isSelf;

                  return (
                    <option key={s.id} value={s.id} disabled={isDisabled}>
                      {s.name} ({s.role === 'superadmin' ? 'Superadmin' : 'Admin / Staff'}) {isDisabled ? '— [Self: Cannot Edit]' : ''}
                    </option>
                  );
                })}
              </select>
              {!isSuperadmin && currentUser?.role === 'admin' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  * Policy rule: Admins can only edit other employees' records.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Shift Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isEditing}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Clock In, Clock Out & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clock In Time
              </label>
              <input
                type="time"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard: 09:00 AM</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clock Out Time
              </label>
              <input
                type="time"
                value={clockOutTime}
                onChange={(e) => setClockOutTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard: 06:00 PM</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Attendance Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="present">Present (On-Time)</option>
                <option value="late">Late Arrival</option>
                <option value="half_day">Half Day Shift</option>
                <option value="on_leave">Approved Leave</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          {/* Breaks Section (Max 2 Breaks) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span>Break Windows ({breaks.length}/2 Allowed)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Everyone is allocated up to 2 recorded break periods (e.g. Lunch & Tea).
                </p>
              </div>

              {breaks.length < 2 && (
                <button
                  type="button"
                  onClick={handleAddBreak}
                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Break {breaks.length + 1}</span>
                </button>
              )}
            </div>

            {breaks.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-slate-50/60">
                No break intervals recorded for this shift yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {breaks.map((b, idx) => (
                  <div 
                    key={b.id} 
                    className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-950 text-xs font-bold flex items-center justify-center">
                        {b.breakNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Break #{b.breakNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">Start Time</span>
                        <input
                          type="time"
                          value={b.startTime}
                          onChange={(e) => handleBreakChange(idx, 'startTime', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block mb-0.5">End Time</span>
                        <input
                          type="time"
                          value={b.endTime}
                          onChange={(e) => handleBreakChange(idx, 'endTime', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-500 block mb-0.5">Label / Note</span>
                        <input
                          type="text"
                          value={b.note}
                          placeholder="e.g. Lunch Break"
                          onChange={(e) => handleBreakChange(idx, 'note', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBreak(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-center"
                      title="Remove break"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Calculation Preview Summary */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-around gap-4 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Shift Time</div>
              <div className="text-base font-bold font-serif text-white">
                {Math.floor(totalWorkMinutes / 60)}h {totalWorkMinutes % 60}m
              </div>
            </div>

            <div className="w-px h-8 bg-slate-800 hidden sm:block" />

            <div>
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Total Break Time</div>
              <div className="text-base font-bold font-serif text-amber-400">
                {Math.floor(totalBreakMinutes / 60)}h {totalBreakMinutes % 60}m
              </div>
            </div>

            <div className="w-px h-8 bg-slate-800 hidden sm:block" />

            <div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Net Productive Hours</div>
              <div className="text-base font-bold font-serif text-emerald-400">
                {Math.floor(netWorkMinutes / 60)}h {netWorkMinutes % 60}m
              </div>
            </div>
          </div>

          {/* Notes & Adjustment Reason */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Shift Notes / Work Log
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of client viewings, meetings, or project work conducted today..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Audit Adjustment Reason (Required for Log Tracking)</span>
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. Corrected missed punch due to client tour offsite"
                  className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Attendance Changes' : 'Confirm Attendance Record'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
