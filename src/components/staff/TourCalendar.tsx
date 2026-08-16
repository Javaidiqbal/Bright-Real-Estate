import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Video, 
  CheckCircle2, 
  Building2, 
  MapPin,
  Sparkles
} from 'lucide-react';

export const TourCalendar: React.FC = () => {
  const { leads, staffList, updateLeadStatus, properties } = useApp();

  const tourLeads = leads.filter(l => l.tourDate || l.status === 'tour_scheduled');

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Tour Appointments & Private Viewings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              {tourLeads.length} Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Confirmed calendar for VIP walkthroughs and 4K interactive live streaming tours
          </p>
        </div>
      </div>

      {/* Agenda Timeline Cards */}
      <div className="space-y-4">
        {tourLeads.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
            <CalendarIcon className="w-12 h-12 stroke-1 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Scheduled Tours</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Client tour requests submitted through the public marketplace will populate here automatically.
            </p>
          </div>
        ) : (
          tourLeads.map((tour) => {
            const agent = staffList.find(s => s.id === tour.assignedAgentId);
            const prop = properties.find(p => p.id === tour.propertyId);

            return (
              <div
                key={tour.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Date & Time Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-900 shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {tour.tourDate ? new Date(tour.tourDate).toLocaleDateString('en-US', { month: 'short' }) : 'AUG'}
                    </span>
                    <span className="text-xl font-bold font-serif">
                      {tour.tourDate ? new Date(tour.tourDate).getDate() : '19'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {tour.tourTime || '14:00'}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                        tour.tourType === 'virtual_video'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tour.tourType === 'virtual_video' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {tour.tourType === 'virtual_video' ? '4K Live Stream' : 'In-Person VIP'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {tour.propertyTitle || 'Listing Tour'}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Client: <strong>{tour.clientName}</strong></span>
                      <span>•</span>
                      <span>{tour.clientPhone}</span>
                      <span>•</span>
                      <span>{tour.clientEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Agent & Status Confirmation */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Hosting Advisor</div>
                    <div className="text-xs font-bold text-slate-900">{agent?.name || 'Assigned Partner'}</div>
                  </div>

                  {tour.status === 'tour_scheduled' ? (
                    <button
                      onClick={() => updateLeadStatus(tour.id, 'contacted', 'Completed tour walkthrough with client.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tour Confirmed</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateLeadStatus(tour.id, 'tour_scheduled', 'Confirmed tour schedule with VIP client.')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
                    >
                      Confirm Schedule
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
