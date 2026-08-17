import React, { useState } from 'react';
import { Property, LeadInquiry } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPropertyPrice, formatRupees } from '../../utils/formatters';
import { 
  X, 
  Heart, 
  Share2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  Calculator, 
  ShieldCheck, 
  Clock, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Video,
  User,
  Check
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
}) => {
  const { 
    favorites, 
    toggleFavorite, 
    staffList, 
    submitLeadInquiry 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'tour' | 'inquire'>('overview');
  
  // Tour booking state
  const [tourType, setTourType] = useState<'in_person' | 'virtual_video'>('in_person');
  const [tourDate, setTourDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [tourTime, setTourTime] = useState('14:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [preApproved, setPreApproved] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const isFavorite = favorites.includes(property.id);
  const agent = staffList.find(s => s.id === property.assignedAgentId) || staffList[0];

  // Mortgage calculations
  const homePrice = property.price;
  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPrincipalAndInterest = monthlyRate > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : loanAmount / numberOfPayments;

  const monthlyPropertyTax = property.propertyTaxAnnual / 12;
  const monthlyHomeInsurance = (homePrice * 0.0035) / 12; // ~0.35% annual insurance estimate
  const monthlyHoa = property.hoaFeeMonthly || 0;
  const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHoa);

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    submitLeadInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '(Not provided)',
      leadType: 'tour_booking',
      message: clientMessage || `Requested a ${tourType === 'in_person' ? 'Private In-Person Tour' : '4K Live Video Tour'} for ${tourDate} at ${tourTime}.`,
      tourDate,
      tourTime,
      tourType,
      assignedAgentId: agent?.id || 'staff-1',
      assignedAgentName: agent?.name || 'Assigned Partner',
      budgetRange: `PKR ${(property.price * 0.9 / 1000000).toFixed(1)}M - ${(property.price * 1.1 / 1000000).toFixed(1)}M`,
      preApprovedMortgage: preApproved,
    });

    setSubmittedSuccess(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    submitLeadInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '(Not provided)',
      leadType: 'inquiry',
      message: clientMessage || 'Interested in receiving detailed disclosures, floor plans, and seller timeline.',
      assignedAgentId: agent?.id || 'staff-1',
      assignedAgentName: agent?.name || 'Assigned Partner',
      preApprovedMortgage: preApproved,
    });

    setSubmittedSuccess(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white text-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 relative">
        
        {/* Sticky Modal Top Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              {property.listingType === 'for_sale' ? 'For Sale' : 'For Lease'}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              MLS #{property.mlsNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isFavorite ? 'Saved' : 'Save'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Share listing link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* 1. High-Res Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {property.images.length > 1 && (
                <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() => setActiveImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                    className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs transition-all pointer-events-auto shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                    className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs transition-all pointer-events-auto shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>{activeImageIndex + 1} / {property.images.length} Photos</span>
              </div>
            </div>

            {/* Thumbnail Filmstrip */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex ? 'border-amber-500 scale-95 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Key Specs & Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{property.neighborhood}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {property.title}
              </h1>
              <p className="text-sm text-slate-600 italic">
                {property.tagline}
              </p>
            </div>

            <div className="lg:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
                {formatPropertyPrice(property.price, property.listingType)}
              </div>
              {property.listingType === 'for_sale' && (
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Est. {formatPropertyPrice(totalMonthlyPayment, 'for_rent')} payment
                </div>
              )}
            </div>
          </div>

          {/* 3. Core Architectural Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <BedDouble className="w-4 h-4" /> Bedrooms
              </div>
              <div className="text-lg font-bold text-slate-900">{property.bedrooms}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Bath className="w-4 h-4" /> Bathrooms
              </div>
              <div className="text-lg font-bold text-slate-900">{property.bathrooms}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Maximize2 className="w-4 h-4" /> Living Area
              </div>
              <div className="text-lg font-bold text-slate-900">{property.sqft.toLocaleString()} <span className="text-xs font-normal text-slate-500">sqft</span></div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Car className="w-4 h-4" /> Garage
              </div>
              <div className="text-lg font-bold text-slate-900">{property.garageSpaces} <span className="text-xs font-normal text-slate-500">Cars</span></div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" /> Year Built
              </div>
              <div className="text-lg font-bold text-slate-900">{property.yearBuilt}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-xs flex items-center gap-1 mb-1">
                <Coins className="w-4 h-4" /> HOA Dues
              </div>
              <div className="text-lg font-bold text-slate-900">
                {property.hoaFeeMonthly > 0 ? formatPropertyPrice(property.hoaFeeMonthly, 'for_rent') : 'None'}
              </div>
            </div>
          </div>

          {/* 4. Tab Navigation for Details, Tour Booking, Mortgage, Contact */}
          <div className="border-b border-slate-200">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Property Overview
              </button>

              <button
                onClick={() => setActiveTab('tour')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'tour'
                    ? 'border-amber-600 text-amber-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule VIP Tour
              </button>

              {property.listingType === 'for_sale' && (
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'calculator'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Mortgage Calculator
                </button>
              )}

              <button
                onClick={() => setActiveTab('inquire')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'inquire'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Inquire & Disclosures
              </button>
            </div>
          </div>

          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150">
              
              {/* Left 2 Cols: Description & Amenities */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                    About This Residence
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 mb-3">
                    Curated Features & Architectural Finishes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Tax & Financials Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Tax & Ownership Disclosures
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Annual Property Tax</span>
                      <strong className="text-slate-900 text-sm">{formatRupees(property.propertyTaxAnnual)}/yr</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">HOA / Maintenance</span>
                      <strong className="text-slate-900 text-sm">{formatPropertyPrice(property.hoaFeeMonthly, 'for_rent')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">MLS Registry ID</span>
                      <strong className="text-slate-900 font-mono text-sm">{property.mlsNumber}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Assigned Agent Card & CTA */}
              <div className="space-y-4">
                <div className="bg-slate-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">
                    Exclusive Listing Representative
                  </div>
                  
                  {agent && (
                    <div className="flex items-center gap-3.5 mb-4">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40"
                      />
                      <div>
                        <div className="font-bold text-base text-white">{agent.name}</div>
                        <div className="text-xs text-slate-400">{agent.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{agent.licenseNumber}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{agent?.phone || '(415) 890-3411'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{agent?.email || 'advisory@bightrealestate.com'}</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => setActiveTab('tour')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book VIP Walkthrough</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inquire')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Direct Message Agent</span>
                    </button>
                  </div>
                </div>

                {/* Fast Facts Box */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Private Viewing Protocol
                  </div>
                  <p className="text-amber-800/90 leading-relaxed text-[11px]">
                    Private viewings are conducted with discreet entry. Pre-approval letters or proof of funds requested prior to confirmation.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIP Tour Booking Form */}
          {activeTab === 'tour' && (
            <div className="max-w-2xl mx-auto py-2 animate-in fade-in duration-150">
              {submittedSuccess ? (
                <div className="text-center py-10 bg-emerald-50 rounded-3xl border border-emerald-200 p-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">Tour Booking Request Received</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 mb-6">
                    Thank you, <strong>{clientName}</strong>. Our Senior Partner <strong>{agent?.name}</strong> has received your VIP tour request for <strong>{tourDate} at {tourTime}</strong> and will contact you via {clientEmail} to confirm security clearance.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setActiveTab('overview');
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Back to Property Details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold font-serif text-slate-900">Schedule a Private Viewing</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose your preferred format and time for a personalized walkthrough of {property.title}
                    </p>
                  </div>

                  {/* Tour Type Select */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTourType('in_person')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        tourType === 'in_person'
                          ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-5 h-5 text-amber-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">Private In-Person Tour</div>
                      <div className="text-[10px] text-slate-500">Walk through with Listing Partner</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTourType('virtual_video')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        tourType === 'virtual_video'
                          ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Video className="w-5 h-5 text-indigo-600 mb-1" />
                      <div className="text-xs font-bold text-slate-900">4K Live Video Walkthrough</div>
                      <div className="text-[10px] text-slate-500">Interactive live streaming session</div>
                    </button>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Slot *</label>
                      <select
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      >
                        <option value="10:00">10:00 AM (Morning)</option>
                        <option value="12:00">12:00 PM (Noon)</option>
                        <option value="14:00">02:00 PM (Afternoon)</option>
                        <option value="16:00">04:00 PM (Late Afternoon)</option>
                        <option value="18:00">06:00 PM (Sunset / Twilight)</option>
                      </select>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Alexander Wright"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="alexander@domain.com"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(415) 555-0192"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={preApproved}
                          onChange={(e) => setPreApproved(e.target.checked)}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span>Pre-approved / Proof of funds available</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requests or Accompanying Guests</label>
                    <textarea
                      rows={3}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="Attending with interior architect, requesting garden and parking walkthrough..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Confirm & Submit Tour Booking</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Mortgage & Monthly Cost Calculator */}
          {activeTab === 'calculator' && (
            <div className="max-w-3xl mx-auto py-2 animate-in fade-in duration-150">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold font-serif text-slate-900">Estimated Monthly Ownership Breakdown</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {formatRupees(property.price)} purchase price
                </p>
              </div>

              {/* Payment Summary Header */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Estimated Total Monthly Cost</div>
                  <div className="text-3xl sm:text-4xl font-bold font-serif text-amber-400">
                    {formatRupees(totalMonthlyPayment)} <span className="text-xs text-slate-300 font-sans font-normal">/ month</span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-300">
                  <div>Loan Amount: <strong>{formatRupees(loanAmount)}</strong></div>
                  <div>Down Payment: <strong>{formatRupees(downPaymentAmount)} ({downPaymentPercent}%)</strong></div>
                </div>
              </div>

              {/* Payment Distribution Bar */}
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${(monthlyPrincipalAndInterest / totalMonthlyPayment) * 100}%` }} 
                    className="bg-amber-500 h-full" 
                    title="Principal & Interest" 
                  />
                  <div 
                    style={{ width: `${(monthlyPropertyTax / totalMonthlyPayment) * 100}%` }} 
                    className="bg-sky-500 h-full" 
                    title="Property Taxes" 
                  />
                  <div 
                    style={{ width: `${(monthlyHomeInsurance / totalMonthlyPayment) * 100}%` }} 
                    className="bg-emerald-500 h-full" 
                    title="Home Insurance" 
                  />
                  {monthlyHoa > 0 && (
                    <div 
                      style={{ width: `${(monthlyHoa / totalMonthlyPayment) * 100}%` }} 
                      className="bg-purple-500 h-full" 
                      title="HOA Fees" 
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-slate-600">P&I: {formatRupees(monthlyPrincipalAndInterest)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span className="text-slate-600">Taxes: {formatRupees(monthlyPropertyTax)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-600">Insurance: {formatRupees(monthlyHomeInsurance)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span className="text-slate-600">HOA: {formatRupees(monthlyHoa)}</span>
                  </div>
                </div>
              </div>

              {/* Sliders & Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Down Payment</span>
                    <span className="text-amber-700">{downPaymentPercent}% ({formatRupees(downPaymentAmount)})</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Interest Rate</span>
                    <span className="text-amber-700">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={3.5}
                    max={10.0}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loan Term</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLoanTermYears(30)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        loanTermYears === 30 ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      30 Years
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoanTermYears(15)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        loanTermYears === 15 ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      15 Years
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: General Inquire / Offer / Disclosures */}
          {activeTab === 'inquire' && (
            <div className="max-w-2xl mx-auto py-2 animate-in fade-in duration-150">
              {submittedSuccess ? (
                <div className="text-center py-10 bg-emerald-50 rounded-3xl border border-emerald-200 p-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">Inquiry Delivered Directly to Agent</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 mb-6">
                    Thank you, <strong>{clientName}</strong>. Your message regarding <strong>{property.title}</strong> has been logged in our agent system. <strong>{agent?.name}</strong> will reply promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedSuccess(false);
                      setActiveTab('overview');
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Back to Overview
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold font-serif text-slate-900">Request Information & Disclosures</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct transmission to Listing Agent {agent?.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(415) 555-0199"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Inquiries *</label>
                    <textarea
                      rows={4}
                      required
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="Please send full title disclosure packet, HOA regulations, and details on unlisted inclusions..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Transmit Message to Partner</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
