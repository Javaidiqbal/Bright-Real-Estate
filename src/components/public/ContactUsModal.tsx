import React, { useState } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  X, 
  Crown, 
  Edit3,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const { 
    websiteContent, 
    currentUser, 
    submitLeadInquiry,
    setInterface,
    setActiveStaffTab
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('General Luxury Property Advisory');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitLeadInquiry({
      clientName: name.trim(),
      clientEmail: email.trim(),
      clientPhone: phone.trim() || '+92 300 0000000',
      type: 'general_question',
      message: `[Subject: ${subject}] ${message.trim()}`,
      preferredTime: 'Anytime during office hours',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  const handleOpenSuperadminEditor = () => {
    onClose();
    setInterface('staff');
    setActiveStaffTab('website_editor');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif">Contact Bight Real Estate</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Ultra-Prime Luxury Property & Investment Advisory</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSuperadmin && (
              <button
                onClick={handleOpenSuperadminEditor}
                className="px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold flex items-center gap-1.5 border border-purple-700/60 transition-colors cursor-pointer"
                title="Edit this text in Superadmin CMS"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Edit Copy</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Agency HQ Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Headquarters & Advisory Center</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {websiteContent.contactOfficeAddress}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {websiteContent.contactMapLocationName}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Advisory Hours & Concierge</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {websiteContent.contactHours}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] text-emerald-700 font-semibold">Advisors Online & Available</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Communication Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <a
              href={`tel:${websiteContent.contactPhone.replace(/\s+/g, '')}`}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-center gap-2.5 text-slate-700"
            >
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Direct Line</span>
                <span className="font-semibold truncate">{websiteContent.contactPhone}</span>
              </div>
            </a>

            <a
              href={`https://wa.me/${websiteContent.contactWhatsApp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex items-center gap-2.5 text-slate-700"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">WhatsApp VIP</span>
                <span className="font-semibold truncate">{websiteContent.contactWhatsApp}</span>
              </div>
            </a>

            <a
              href={`mailto:${websiteContent.contactEmail}`}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center gap-2.5 text-slate-700"
            >
              <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Official Inquiries</span>
                <span className="font-semibold truncate">{websiteContent.contactEmail}</span>
              </div>
            </a>
          </div>

          {/* Inquiry Form */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold font-serif text-slate-900 mb-1">
              Send an Advisory Message
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Our licensed partners respond within 2 business hours with confidential evaluation dossiers.
            </p>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Message Dispatched Successfully</h4>
                <p className="text-xs text-emerald-700">
                  Thank you, {name}. A senior luxury advisor has received your request and will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Asad Raza"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="asad@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="General Luxury Property Advisory">General Luxury Property Advisory</option>
                      <option value="Acquisition & Buyer Representation">Acquisition & Buyer Representation</option>
                      <option value="Private Estate Listing & Valuation">Private Estate Listing & Valuation</option>
                      <option value="Commercial & Institutional Portfolios">Commercial & Institutional Portfolios</option>
                      <option value="4K Virtual VIP Tour Request">4K Virtual VIP Tour Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements *</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the property type, preferred sector/city, or specific guidance you are seeking..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
