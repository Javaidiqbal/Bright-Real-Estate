import React, { useState, useEffect, useMemo } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { AttendanceRecord, AttendanceBreak, AttendanceStatus } from '../../types';
import { AttendanceEditorModal } from './AttendanceEditorModal';
import { 
  Clock, 
  Play, 
  Square, 
  Coffee, 
  Calendar, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Crown, 
  ShieldCheck, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Award,
  History,
  Users,
  Timer,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const { 
    currentUser, 
    staffList, 
    attendanceRecords, 
    todayAttendanceRecord, 
    clockIn, 
    clockOut, 
    startBreak, 
    endBreak,
    deleteAttendanceRecord
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const isAdmin = currentUser?.role === 'admin';
  const canManageTeam = isSuperadmin || isAdmin;

  // View tabs
  const [activeView, setActiveView] = useState<'my_clock' | 'team_roster'>(
    canManageTeam ? 'team_roster' : 'my_clock'
  );

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Punch actions UI state
  const [clockInNote, setClockInNote] = useState('');
  const [breakNote, setBreakNote] = useState('');
  const [clockOutNote, setClockOutNote] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal for editing/adding
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Team roster filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Personal log filters
  const [personalFilterMonth, setPersonalFilterMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  // Auto clear alerts
  useEffect(() => {
    if (actionError || actionSuccess) {
      const t = setTimeout(() => {
        setActionError(null);
        setActionSuccess(null);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [actionError, actionSuccess]);

  // Check current user active break
  const activeBreak = useMemo(() => {
    if (!todayAttendanceRecord) return undefined;
    return todayAttendanceRecord.breaks.find(b => !b.endTime);
  }, [todayAttendanceRecord]);

  const completedBreaksCount = useMemo(() => {
    if (!todayAttendanceRecord) return 0;
    return todayAttendanceRecord.breaks.filter(b => !!b.endTime).length;
  }, [todayAttendanceRecord]);

  const totalBreaksTaken = todayAttendanceRecord?.breaks.length || 0;
  const isBreakLimitReached = totalBreaksTaken >= 2 && !activeBreak;

  // Handlers for Punch Actions
  const handleClockIn = () => {
    setActionError(null);
    const res = clockIn(clockInNote);
    if (!res.success) {
      setActionError(res.error || 'Failed to clock in');
    } else {
      setActionSuccess('Successfully clocked in! Have a productive shift.');
      setClockInNote('');
    }
  };

  const handleStartBreak = (noteText?: string) => {
    setActionError(null);
    const chosenNote = noteText || breakNote || (totalBreaksTaken === 0 ? 'Meal / Lunch Break' : 'Tea / Coffee Break');
    const res = startBreak(chosenNote);
    if (!res.success) {
      setActionError(res.error || 'Failed to start break');
    } else {
      setActionSuccess(`Break started: ${chosenNote}`);
      setBreakNote('');
    }
  };

  const handleEndBreak = () => {
    setActionError(null);
    const res = endBreak();
    if (!res.success) {
      setActionError(res.error || 'Failed to end break');
    } else {
      setActionSuccess('Break ended. Welcome back to work!');
    }
  };

  const handleClockOut = () => {
    if (!window.confirm('Are you ready to clock out and conclude your work shift for today?')) {
      return;
    }
    setActionError(null);
    const res = clockOut(clockOutNote);
    if (!res.success) {
      setActionError(res.error || 'Failed to clock out');
    } else {
      setActionSuccess('Successfully clocked out. Great work today!');
      setClockOutNote('');
    }
  };

  // Helper date formatting
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  // Filtered attendance for team roster
  const filteredTeamRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      // Date filter
      if (filterDateRange === 'today' && record.date !== todayStr) return false;
      if (filterDateRange === 'yesterday' && record.date !== yesterdayStr) return false;
      if (filterDateRange === 'custom' && record.date !== customDate) return false;
      if (filterDateRange === 'month') {
        const currentMonthPrefix = new Date().toISOString().slice(0, 7);
        if (!record.date.startsWith(currentMonthPrefix)) return false;
      }
      if (filterDateRange === 'week') {
        const recTime = new Date(record.date).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (recTime < sevenDaysAgo) return false;
      }

      // Status filter
      if (filterStatus !== 'all' && record.status !== filterStatus) return false;

      // Role filter
      if (filterRole !== 'all' && record.userRole !== filterRole) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = record.userName.toLowerCase().includes(query);
        const matchEmail = record.userEmail.toLowerCase().includes(query);
        const matchTitle = record.userTitle?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchTitle) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, filterDateRange, todayStr, yesterdayStr, customDate, filterStatus, filterRole, searchQuery]);

  // Personal history records
  const personalRecords = useMemo(() => {
    if (!currentUser) return [];
    return attendanceRecords.filter(r => 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase()) &&
      r.date.startsWith(personalFilterMonth)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, currentUser, personalFilterMonth]);

  // Personal statistics
  const personalStats = useMemo(() => {
    const totalDays = personalRecords.length;
    const presentDays = personalRecords.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'half_day').length;
    const onTimeDays = personalRecords.filter(r => r.status === 'present').length;
    const totalNetMinutes = personalRecords.reduce((acc, r) => acc + (r.netWorkMinutes || 0), 0);
    const totalBreakMinutes = personalRecords.reduce((acc, r) => acc + (r.totalBreakMinutes || 0), 0);
    const avgDailyMinutes = totalDays > 0 ? Math.round(totalNetMinutes / totalDays) : 0;
    const onTimeRate = totalDays > 0 ? Math.round((onTimeDays / totalDays) * 100) : 100;

    return {
      totalDays,
      presentDays,
      onTimeDays,
      onTimeRate,
      totalNetHours: (totalNetMinutes / 60).toFixed(1),
      avgDailyHours: (avgDailyMinutes / 60).toFixed(1),
      totalBreakHours: (totalBreakMinutes / 60).toFixed(1)
    };
  }, [personalRecords]);

  // Team summary counts for today
  const todayTeamStats = useMemo(() => {
    const todayRecs = attendanceRecords.filter(r => r.date === todayStr);
    const workingNow = todayRecs.filter(r => r.clockIn && !r.clockOut && !r.breaks.some(b => !b.endTime)).length;
    const onBreakNow = todayRecs.filter(r => r.breaks.some(b => !b.endTime)).length;
    const completedShift = todayRecs.filter(r => !!r.clockOut).length;
    const lateToday = todayRecs.filter(r => r.status === 'late').length;
    const onLeaveToday = todayRecs.filter(r => r.status === 'on_leave').length;

    return {
      totalLogged: todayRecs.length,
      workingNow,
      onBreakNow,
      completedShift,
      lateToday,
      onLeaveToday,
      totalStaff: staffList.length
    };
  }, [attendanceRecords, todayStr, staffList]);

  // Export CSV generator
  const exportAttendanceCSV = (recordsToExport: AttendanceRecord[], filenamePrefix: string) => {
    if (recordsToExport.length === 0) {
      alert('No attendance records to export for the selected filter.');
      return;
    }

    const headers = [
      'Date',
      'Employee Name',
      'Email',
      'Role',
      'Designation',
      'Status',
      'Clock In',
      'Break 1 (Start - End)',
      'Break 1 Duration (Mins)',
      'Break 2 (Start - End)',
      'Break 2 Duration (Mins)',
      'Clock Out',
      'Total Break (Mins)',
      'Total Shift (Hours)',
      'Net Productive (Hours)',
      'Notes',
      'Last Modified By',
      'Adjustment Reason'
    ];

    const rows = recordsToExport.map(r => {
      const b1 = r.breaks[0];
      const b2 = r.breaks[1];

      const formatTime = (iso?: string) => {
        if (!iso) return '-';
        try {
          return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
          return '-';
        }
      };

      const b1Str = b1 ? `${formatTime(b1.startTime)} - ${formatTime(b1.endTime)} (${b1.note})` : 'None';
      const b2Str = b2 ? `${formatTime(b2.startTime)} - ${formatTime(b2.endTime)} (${b2.note})` : 'None';

      return [
        `"${r.date}"`,
        `"${r.userName}"`,
        `"${r.userEmail}"`,
        `"${r.userRole}"`,
        `"${r.userTitle || ''}"`,
        `"${r.status.toUpperCase()}"`,
        `"${formatTime(r.clockIn)}"`,
        `"${b1Str}"`,
        `"${b1?.durationMinutes || 0}"`,
        `"${b2Str}"`,
        `"${b2?.durationMinutes || 0}"`,
        `"${formatTime(r.clockOut)}"`,
        `"${r.totalBreakMinutes || 0}"`,
        `"${((r.totalWorkMinutes || 0) / 60).toFixed(2)}"`,
        `"${((r.netWorkMinutes || 0) / 60).toFixed(2)}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        `"${r.editedBy?.userName || 'Self / System'}"`,
        `"${(r.editedBy?.reason || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Present
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Late
          </span>
        );
      case 'half_day':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Half Day
          </span>
        );
      case 'on_leave':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            On Leave
          </span>
        );
      case 'absent':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Absent
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimeDisplay = (isoStr?: string) => {
    if (!isoStr) return '--:--';
    try {
      return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner with Live Digital Clock */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bight Real Estate Workforce Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              Attendance & Time Tracking
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Accurate shift check-ins, automated break monitoring (max 2 breaks/day), 
              and administrative audit controls for our brokerage team.
            </p>
          </div>

          {/* Live Digital Clock Widget */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-950/70 rounded-2xl border border-slate-800">
            {canManageTeam && (
              <button
                onClick={() => setActiveView('team_roster')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeView === 'team_roster'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Attendance Roster</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-900/40 text-[10px] font-mono">
                  {todayTeamStats.totalLogged}/{todayTeamStats.totalStaff}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveView('my_clock')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'my_clock'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>My Time Clock & Punch Card</span>
            </button>
          </div>

          {/* Quick Authority Tag */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {isSuperadmin ? (
              <span className="inline-flex items-center gap-1.5 text-purple-300 bg-purple-950/60 border border-purple-800/80 px-3 py-1 rounded-full font-medium">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Superadmin (Full Access & Override)
              </span>
            ) : isAdmin ? (
              <span className="inline-flex items-center gap-1.5 text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Admin (Can Edit Employees; Cannot Edit Own)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1 rounded-full font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Staff Member Self-Tracking
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: MY TIME CLOCK & PUNCH CARD                                       */}
      {/* ========================================================================= */}
      {activeView === 'my_clock' && (
        <div className="space-y-6">
          
          {/* Main Interactive Clock-in Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Active Shift Status
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    {currentUser?.name}
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {currentUser?.title || (currentUser?.role === 'superadmin' ? 'Managing Principal & Broker' : 'Real Estate Advisor')}
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                {activeBreak ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
                    <Coffee className="w-4 h-4" />
                    <span>On Break #{activeBreak.breakNumber} ({activeBreak.note})</span>
                  </span>
                ) : todayAttendanceRecord?.clockIn && !todayAttendanceRecord?.clockOut ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>Clocked In & Working</span>
                  </span>
                ) : todayAttendanceRecord?.clockOut ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center gap-2">
                    <Square className="w-3.5 h-3.5 text-amber-400" />
                    <span>Shift Concluded for Today</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-2 border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Not Clocked In Yet</span>
                  </span>
                )}
              </div>
            </div>

            {/* Shift Timeline / Break Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Clock In Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Clock In Time
                </div>
                <div className="text-lg font-bold font-serif text-slate-900">
                  {formatTimeDisplay(todayAttendanceRecord?.clockIn)}
                </div>
                <div className="text-[11px] text-slate-500">
                  {todayAttendanceRecord?.clockIn ? (todayAttendanceRecord.status === 'late' ? 'Late Arrival' : 'On-Time') : 'Pending clock-in'}
                </div>
              </div>

              {/* Break 1 Slot */}
              <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
                todayAttendanceRecord?.breaks[0]
                  ? (todayAttendanceRecord.breaks[0].endTime ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-100 border-amber-400 shadow-md')
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  <span className="flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-amber-600" />
                    Break #1 (Max 2)
                  </span>
                  {todayAttendanceRecord?.breaks[0] && (
                    <span className="font-mono">{todayAttendanceRecord.breaks[0].durationMinutes || 0}m</span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {todayAttendanceRecord?.breaks[0] ? (
                    todayAttendanceRecord.breaks[0].endTime ? (
                      `${formatTimeDisplay(todayAttendanceRecord.breaks[0].startTime)} - ${formatTimeDisplay(todayAttendanceRecord.breaks[0].endTime)}`
                    ) : (
                      <span className="text-amber-900 animate-pulse font-semibold">Active now (Started {formatTimeDisplay(todayAttendanceRecord.breaks[0].startTime)})</span>
                    )
                  ) : (
                    <span className="text-slate-400 font-normal">Available (e.g. Lunch)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {todayAttendanceRecord?.breaks[0]?.note || 'Not taken yet'}
                </div>
              </div>

              {/* Break 2 Slot */}
              <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
                todayAttendanceRecord?.breaks[1]
                  ? (todayAttendanceRecord.breaks[1].endTime ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-100 border-amber-400 shadow-md')
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  <span className="flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-amber-600" />
                    Break #2 (Max 2)
                  </span>
                  {todayAttendanceRecord?.breaks[1] && (
                    <span className="font-mono">{todayAttendanceRecord.breaks[1].durationMinutes || 0}m</span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {todayAttendanceRecord?.breaks[1] ? (
                    todayAttendanceRecord.breaks[1].endTime ? (
                      `${formatTimeDisplay(todayAttendanceRecord.breaks[1].startTime)} - ${formatTimeDisplay(todayAttendanceRecord.breaks[1].endTime)}`
                    ) : (
                      <span className="text-amber-900 animate-pulse font-semibold">Active now (Started {formatTimeDisplay(todayAttendanceRecord.breaks[1].startTime)})</span>
                    )
                  ) : (
                    <span className="text-slate-400 font-normal">Available (e.g. Tea)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {todayAttendanceRecord?.breaks[1]?.note || 'Not taken yet'}
                </div>
              </div>

              {/* Clock Out / Total */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Clock Out & Net Hours
                </div>
                <div className="text-lg font-bold font-serif text-slate-900">
                  {formatTimeDisplay(todayAttendanceRecord?.clockOut)}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  {todayAttendanceRecord?.netWorkMinutes 
                    ? `${Math.floor(todayAttendanceRecord.netWorkMinutes / 60)}h ${todayAttendanceRecord.netWorkMinutes % 60}m net worked` 
                    : 'In progress'}
                </div>
              </div>

            </div>

            {/* Interactive Action Controls */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    Self-Service Time Controls
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mark your daily attendance and break start/end times in real-time.
                  </p>
                </div>

                <div className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  Breaks taken today: <span className="font-bold text-amber-400">{totalBreaksTaken}/2</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                {/* 1. CLOCK IN BUTTON */}
                {!todayAttendanceRecord?.clockIn ? (
                  <button
                    onClick={handleClockIn}
                    className="p-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>Clock In Now</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Clocked In ({formatTimeDisplay(todayAttendanceRecord.clockIn)})</span>
                  </div>
                )}

                {/* 2. BREAK CONTROL BUTTON */}
                {activeBreak ? (
                  <button
                    onClick={handleEndBreak}
                    className="p-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg animate-pulse transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Coffee className="w-5 h-5" />
                    <span>End Break #{activeBreak.breakNumber}</span>
                  </button>
                ) : !todayAttendanceRecord?.clockIn || todayAttendanceRecord?.clockOut ? (
                  <button
                    disabled
                    className="p-4 rounded-xl bg-slate-800/40 text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Start Break (Clock in first)</span>
                  </button>
                ) : isBreakLimitReached ? (
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-400/80 font-semibold text-xs flex items-center justify-center gap-2">
                    <Coffee className="w-4 h-4" />
                    <span>Max 2 Breaks Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartBreak()}
                    className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-sm border border-amber-400/40 flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Coffee className="w-5 h-5" />
                    <span>Start Break #{totalBreaksTaken + 1} of 2</span>
                  </button>
                )}

                {/* 3. CLOCK OUT BUTTON */}
                {todayAttendanceRecord?.clockIn && !todayAttendanceRecord?.clockOut ? (
                  <button
                    onClick={handleClockOut}
                    className="p-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span>Clock Out & End Shift</span>
                  </button>
                ) : todayAttendanceRecord?.clockOut ? (
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Clocked Out ({formatTimeDisplay(todayAttendanceRecord.clockOut)})</span>
                  </div>
                ) : (
                  <button
                    disabled
                    className="p-4 rounded-xl bg-slate-800/40 text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Square className="w-4 h-4" />
                    <span>Clock Out</span>
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Personal Monthly Attendance Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-500" />
                  <span>My Monthly Attendance History</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Review your personal timesheet entries, punctuality rate, and break summaries.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="month"
                  value={personalFilterMonth}
                  onChange={(e) => setPersonalFilterMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-400"
                />

                <button
                  onClick={() => exportAttendanceCSV(personalRecords, `My_Attendance_${currentUser?.name.replace(/\s+/g, '_')}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Days Logged</div>
                <div className="text-xl font-bold font-serif text-slate-900 mt-1">{personalStats.presentDays} Days</div>
                <div className="text-[11px] text-slate-500">Active shifts this month</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Punctuality Rate</div>
                <div className="text-xl font-bold font-serif text-emerald-800 mt-1">{personalStats.onTimeRate}%</div>
                <div className="text-[11px] text-emerald-600">{personalStats.onTimeDays} On-Time arrivals</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">Net Productive Hours</div>
                <div className="text-xl font-bold font-serif text-indigo-800 mt-1">{personalStats.totalNetHours} hrs</div>
                <div className="text-[11px] text-indigo-600">Avg {personalStats.avgDailyHours} hrs/day</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Total Breaks</div>
                <div className="text-xl font-bold font-serif text-amber-800 mt-1">{personalStats.totalBreakHours} hrs</div>
                <div className="text-[11px] text-amber-600">Max 2 breaks/day</div>
              </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Break 1 (Lunch)</th>
                    <th className="py-3 px-4">Break 2 (Tea)</th>
                    <th className="py-3 px-4">Clock Out</th>
                    <th className="py-3 px-4">Total Break</th>
                    <th className="py-3 px-4">Net Worked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {personalRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No attendance records found for {personalFilterMonth}.
                      </td>
                    </tr>
                  ) : (
                    personalRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{r.date}</td>
                        <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                        <td className="py-3 px-4">{formatTimeDisplay(r.clockIn)}</td>
                        <td className="py-3 px-4">
                          {r.breaks[0] ? (
                            <span className="text-[11px]">
                              {formatTimeDisplay(r.breaks[0].startTime)} - {formatTimeDisplay(r.breaks[0].endTime)} ({r.breaks[0].durationMinutes || 0}m)
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {r.breaks[1] ? (
                            <span className="text-[11px]">
                              {formatTimeDisplay(r.breaks[1].startTime)} - {formatTimeDisplay(r.breaks[1].endTime)} ({r.breaks[1].durationMinutes || 0}m)
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{formatTimeDisplay(r.clockOut)}</td>
                        <td className="py-3 px-4 text-amber-700 font-semibold">{r.totalBreakMinutes || 0} mins</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          {r.netWorkMinutes ? `${Math.floor(r.netWorkMinutes / 60)}h ${r.netWorkMinutes % 60}m` : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TEAM ATTENDANCE ROSTER (ADMIN & SUPERADMIN)                      */}
      {/* ========================================================================= */}
      {activeView === 'team_roster' && canManageTeam && (
        <div className="space-y-6">
          
          {/* Live Team Status Dashboard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Working Now</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
                {todayTeamStats.workingNow}
              </div>
              <div className="text-[11px] text-slate-500">Active at their desks/field</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>On Break</span>
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-amber-700 mt-1">
                {todayTeamStats.onBreakNow}
              </div>
              <div className="text-[11px] text-slate-500">In 1st or 2nd break</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Shift Concluded</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1">
                {todayTeamStats.completedShift}
              </div>
              <div className="text-[11px] text-slate-500">Clocked out today</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Late Arrivals</span>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-amber-600 mt-1">
                {todayTeamStats.lateToday}
              </div>
              <div className="text-[11px] text-slate-500">After 09:30 AM</div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Total Roster</span>
                <Users className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-indigo-700 mt-1">
                {todayTeamStats.totalLogged} / {todayTeamStats.totalStaff}
              </div>
              <div className="text-[11px] text-slate-500">Recorded shifts today</div>
            </div>

          </div>

          {/* Roster Controls & Filters */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span>Team Attendance Log & Shift Registry</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {isSuperadmin
                    ? 'Superadmin View: Full authority to view, log, edit, and delete any employee or admin attendance records.'
                    : 'Admin View: Authority to monitor and adjust employee records. Self-editing is disabled per security rules.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    setEditingRecord(null);
                    setIsEditorModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Manual Attendance</span>
                </button>

                <button
                  onClick={() => exportAttendanceCSV(filteredTeamRecords, 'Bight_Team_Attendance')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Filtered CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="today">Today ({todayStr})</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Date Pick</option>
                </select>
              </div>

              {/* Custom Date Input if selected */}
              {filterDateRange === 'custom' && (
                <div>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Role Filter */}
              <div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="all">All Staff Roles</option>
                  <option value="agent">Real Estate Agents</option>
                  <option value="admin">Administrators</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="all">All Attendance Statuses</option>
                  <option value="present">Present (On-Time)</option>
                  <option value="late">Late Arrival</option>
                  <option value="half_day">Half Day</option>
                  <option value="on_leave">Approved Leave</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

            </div>

            {/* Team Roster Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-900 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Break 1 (Lunch)</th>
                    <th className="py-3 px-4">Break 2 (Tea)</th>
                    <th className="py-3 px-4">Clock Out</th>
                    <th className="py-3 px-4">Total Break</th>
                    <th className="py-3 px-4">Net Worked</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800 bg-white">
                  {filteredTeamRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <span>No team attendance records match the selected filter.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTeamRecords.map((r) => {
                      const isSelfRecord = r.userId === currentUser?.id || r.userEmail.toLowerCase() === currentUser?.email.toLowerCase();
                      const canEditThis = isSuperadmin || (isAdmin && !isSelfRecord);

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Employee info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-700">
                                {r.userAvatar ? (
                                  <img src={r.userAvatar} alt={r.userName} className="w-full h-full object-cover" />
                                ) : (
                                  r.userName.charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{r.userName}</span>
                                  {isSelfRecord && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <span>{r.userTitle || r.userRole}</span>
                                  <span>•</span>
                                  <span className="capitalize text-slate-400">{r.userRole}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                            {r.date}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getStatusBadge(r.status)}
                          </td>

                          {/* Clock In */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-900">
                              {formatTimeDisplay(r.clockIn)}
                            </span>
                          </td>

                          {/* Break 1 */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {r.breaks[0] ? (
                              <div className="text-[11px]">
                                <div className="font-semibold text-slate-800">
                                  {formatTimeDisplay(r.breaks[0].startTime)} - {r.breaks[0].endTime ? formatTimeDisplay(r.breaks[0].endTime) : 'Running...'}
                                </div>
                                <div className="text-[10px] text-amber-700 font-bold">
                                  {r.breaks[0].durationMinutes ? `${r.breaks[0].durationMinutes}m` : 'Active'} • {r.breaks[0].note}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">None</span>
                            )}
                          </td>

                          {/* Break 2 */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {r.breaks[1] ? (
                              <div className="text-[11px]">
                                <div className="font-semibold text-slate-800">
                                  {formatTimeDisplay(r.breaks[1].startTime)} - {r.breaks[1].endTime ? formatTimeDisplay(r.breaks[1].endTime) : 'Running...'}
                                </div>
                                <div className="text-[10px] text-amber-700 font-bold">
                                  {r.breaks[1].durationMinutes ? `${r.breaks[1].durationMinutes}m` : 'Active'} • {r.breaks[1].note}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">None</span>
                            )}
                          </td>

                          {/* Clock Out */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-900">
                              {formatTimeDisplay(r.clockOut)}
                            </span>
                          </td>

                          {/* Total Breaks */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-amber-800 font-bold">
                            {r.totalBreakMinutes || 0}m ({r.breaks.length}/2)
                          </td>

                          {/* Net Productive Hours */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {r.netWorkMinutes !== undefined && r.netWorkMinutes > 0 ? (
                              <span className="font-bold font-serif text-emerald-800 text-sm">
                                {Math.floor(r.netWorkMinutes / 60)}h {r.netWorkMinutes % 60}m
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {canEditThis ? (
                                <button
                                  onClick={() => {
                                    setEditingRecord(r);
                                    setIsEditorModalOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Edit attendance"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Edit</span>
                                </button>
                              ) : (
                                <span 
                                  className="px-2 py-1 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-semibold cursor-not-allowed flex items-center gap-1"
                                  title="Policy constraint: Admins cannot edit their own attendance records"
                                >
                                  <ShieldAlert className="w-3 h-3 text-slate-400" />
                                  <span>Self (Locked)</span>
                                </span>
                              )}

                              {isSuperadmin && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete attendance record for ${r.userName} on ${r.date}?`)) {
                                      deleteAttendanceRecord(r.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                                  title="Delete record (Superadmin only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Audit editor metadata footnote */}
                            {r.editedBy && (
                              <div className="text-[10px] text-indigo-600 mt-0.5 text-right font-medium">
                                Adj: {r.editedBy.userName}
                              </div>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Policy Info Footnote */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Brokerage Attendance Governance Rules:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] mt-1 text-amber-800">
                  <li>Employees can mark their own attendance and initiate up to 2 recorded break periods (Lunch & Tea).</li>
                  <li>Admins can monitor and adjust employee records, but cannot edit their own records to preserve compliance.</li>
                  <li>Superadmin maintains full override and deletion authority across all system records.</li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Editor Modal for Adding / Adjusting Records */}
      {isEditorModalOpen && (
        <AttendanceEditorModal
          record={editingRecord}
          onClose={() => {
            setIsEditorModalOpen(false);
            setEditingRecord(null);
          }}
          defaultDate={filterDateRange === 'custom' ? customDate : todayStr}
        />
      )}

    </div>
  );
};
