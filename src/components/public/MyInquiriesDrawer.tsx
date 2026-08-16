import React from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { X, Calendar, Clock, CheckCircle2, User, Building, MapPin, AlertCircle } from 'lucide-react';

interface MyInquiriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
}

export const MyInquiriesDrawer: React.FC<MyInquiriesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
}) => {
  const { myPublicInquiries, properties, staffList } = useApp();

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'tour_scheduled':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px] uppercase">Tour Confirmed</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold text-[10px] uppercase">Agent Contacted</span>;
      case 'offer_submitted':
        return <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold text-[10px] uppercase">Offer in Review</span>;
      case 'new':
      default:
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold text-[10px] uppercase">Pending Review</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold font-serif">My Bookings & Inquiries</h2>
              <p className="text-[11px] text-slate-400">Track status of private viewings & inquiries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {myPublicInquiries.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Calendar className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No Active Tour Bookings</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                When you schedule a private tour or request disclosures on any residence, your live status will appear here.
              </p>
            </div>
          ) : (
            myPublicInquiries.map((inq) => {
              const matchedProp = properties.find(p => p.id === inq.propertyId);
              const agent = staffList.find(s => s.id === inq.assignedAgentId);

              return (
                <div
                  key={inq.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(inq.status)}
                        <span className="text-[10px] text-slate-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 
                        onClick={() => {
                          if (matchedProp) {
                            onSelectProperty(matchedProp);
                            onClose();
                          }
                        }}
                        className="text-sm font-bold text-slate-900 mt-1 hover:text-amber-700 cursor-pointer font-serif line-clamp-1"
                      >
                        {inq.propertyTitle || 'General Real Estate Inquiry'}
                      </h4>
                    </div>

                    {matchedProp && (
                      <img
                        src={matchedProp.images[0]}
                        alt="thumb"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    )}
                  </div>

                  {/* Booking details */}
                  {inq.leadType === 'tour_booking' && inq.tourDate && (
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tour Time: {inq.tourDate} at {inq.tourTime}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Format: {inq.tourType === 'virtual_video' ? '4K Live Video Stream' : 'Private On-Site VIP Walkthrough'}
                      </div>
                    </div>
                  )}

                  {/* Message excerpt */}
                  <p className="text-xs text-slate-600 italic bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    "{inq.message}"
                  </p>

                  {/* Assigned Agent Contact */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Advisor: <strong>{inq.assignedAgentName || agent?.name || 'Assigned Partner'}</strong></span>
                    </div>
                    <span className="text-[11px] text-slate-500">Ref ID: {inq.id.slice(-6)}</span>
                  </div>

                  {/* Internal notes from agent if any */}
                  {inq.internalNotes.length > 0 && (
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50 text-[11px] text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-800">
                        <AlertCircle className="w-3 h-3" /> Note from Advisor
                      </div>
                      <div className="italic">
                        {inq.internalNotes[inq.internalNotes.length - 1]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
