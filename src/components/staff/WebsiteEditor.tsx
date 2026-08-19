import React, { useState } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { WebsiteContent } from '../../types';
import { INITIAL_WEBSITE_CONTENT } from '../../data/mockData';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Crown, 
  Lock, 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ExternalLink,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Share2,
  HelpCircle
} from 'lucide-react';

// Custom TikTok icon for sleek aesthetic consistency
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.91 1.6V6.9a4.85 4.85 0 0 1-1-.21z" />
  </svg>
);

export const WebsiteEditor: React.FC = () => {
  const { 
    currentUser, 
    websiteContent, 
    updateWebsiteContent,
    setInterface 
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [formData, setFormData] = useState<WebsiteContent>({
    ...INITIAL_WEBSITE_CONTENT,
    ...websiteContent
  });
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'contact' | 'features' | 'social' | 'footer'>('hero');

  if (!isSuperadmin) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Superadmin Access Required</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Public website copywriting, footer configuration, and social media links governance are strictly reserved for the Superadmin ({SUPERADMIN_EMAIL}).
        </p>
      </div>
    );
  }

  const handleChange = (field: keyof WebsiteContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all public website copy and footer links to agency default presets?')) {
      setFormData({ ...INITIAL_WEBSITE_CONTENT });
      updateWebsiteContent(INITIAL_WEBSITE_CONTENT);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Public Website CMS & Copy Editor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-purple-700" /> Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control over headlines, hero messaging, footer cards, copyright text, and social media links (Facebook, Instagram, YouTube, TikTok).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setInterface('public')}
            className="px-3.5 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>View Live Site</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 sm:px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            title="Reset to default text"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Public website copy & social media links saved successfully and live on marketplace!</span>
          </div>
          <button
            onClick={() => setInterface('public')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Preview Now
          </button>
        </div>
      )}

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'hero', label: 'Hero & Banner', icon: Sparkles },
          { id: 'about', label: 'About & Philosophy', icon: Building },
          { id: 'contact', label: 'Contact Us & Hours', icon: Phone },
          { id: 'features', label: 'Footer 3 Cards', icon: Award },
          { id: 'social', label: 'Social Media Links', icon: Share2 },
          { id: 'footer', label: 'Footer & Copyright', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white font-bold shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* SECTION: HERO & BANNER */}
        {activeSection === 'hero' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Hero Header & Search Banner</h2>
              <p className="text-xs text-slate-500">The primary greeting and search headline seen by public visitors.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Eyebrow / Tagline Pill
              </label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                placeholder="e.g. Curated Architectural Residences & Estates"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Hero Headline (H1)
              </label>
              <input
                type="text"
                value={formData.heroHeading}
                onChange={(e) => handleChange('heroHeading', e.target.value)}
                placeholder="e.g. Discover Exceptional Homes Tailored to Your Life"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Subheading Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.heroSubheading}
                onChange={(e) => handleChange('heroSubheading', e.target.value)}
                placeholder="Brief introduction describing the portfolio and advisory service."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION: ABOUT & STORY */}
        {activeSection === 'about' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">About Us & Agency Philosophy</h2>
              <p className="text-xs text-slate-500">Communicates your luxury brokerage prestige, credentials, and vision.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                About Section Heading
              </label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                placeholder="e.g. The Premier Standard in Luxury Real Estate"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agency Background Description
              </label>
              <textarea
                rows={3}
                value={formData.aboutDescription}
                onChange={(e) => handleChange('aboutDescription', e.target.value)}
                placeholder="Detailed description of Bight Real Estate's capabilities."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fiduciary Commitment / Mission Statement
              </label>
              <textarea
                rows={2}
                value={formData.aboutMission}
                onChange={(e) => handleChange('aboutMission', e.target.value)}
                placeholder="Key promise regarding title audits, client confidentiality, and excellence."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION: CONTACT US */}
        {activeSection === 'contact' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Contact Us & Headquarters Details</h2>
              <p className="text-xs text-slate-500">Contact channels displayed in the Contact tab, footer, and inquiry dialogs.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={formData.contactOfficeAddress}
                onChange={(e) => handleChange('contactOfficeAddress', e.target.value)}
                placeholder="e.g. Suite 402, Executive Heights, Sector F-7/2, Blue Area, Islamabad, Pakistan"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Direct Telephone Number
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+92 51 8489200"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp VIP Concierge
                </label>
                <input
                  type="text"
                  value={formData.contactWhatsApp}
                  onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
                  placeholder="+92 300 5550100"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  General Advisory Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="advisory@bightrealestate.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Operating Hours
                </label>
                <input
                  type="text"
                  value={formData.contactHours}
                  onChange={(e) => handleChange('contactHours', e.target.value)}
                  placeholder="Mon – Sat: 9:00 AM – 7:00 PM (PKT)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / Hub Location Name
              </label>
              <input
                type="text"
                value={formData.contactMapLocationName}
                onChange={(e) => handleChange('contactMapLocationName', e.target.value)}
                placeholder="Islamabad Financial District & F-7 Executive Hub"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION: 3 FOOTER CARDS (ADVISORY PILLARS) */}
        {activeSection === 'features' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Footer 3 Cards (Advisory Pillars)</h2>
              <p className="text-xs text-slate-500">Edit the headings and descriptive text for each of the three cards displayed in the footer above copyright.</p>
            </div>

            {/* Card 1 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Card 1: Selection & Portfolio Guarantee</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Pillar 1</span>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 1 Heading</label>
                <input
                  type="text"
                  value={formData.feature1Title}
                  onChange={(e) => handleChange('feature1Title', e.target.value)}
                  placeholder="Curated Luxury Portfolio"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 1 Description Text</label>
                <textarea
                  rows={3}
                  value={formData.feature1Desc}
                  onChange={(e) => handleChange('feature1Desc', e.target.value)}
                  placeholder="Every residence in our portfolio undergoes a rigorous architectural evaluation and verified title audit before public curation."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Card 2: Fiduciary & Broker Governance</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Pillar 2</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 2 Heading</label>
                <input
                  type="text"
                  value={formData.feature2Title}
                  onChange={(e) => handleChange('feature2Title', e.target.value)}
                  placeholder="Fiduciary Advisory"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 2 Description Text</label>
                <textarea
                  rows={3}
                  value={formData.feature2Desc}
                  onChange={(e) => handleChange('feature2Desc', e.target.value)}
                  placeholder="Our licensed superadmin brokers and luxury advisors protect your interests across valuation, negotiation, and escrow closing."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Card 3: 4K Tours & VIP Concierge</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Pillar 3</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 3 Heading</label>
                <input
                  type="text"
                  value={formData.feature3Title}
                  onChange={(e) => handleChange('feature3Title', e.target.value)}
                  placeholder="4K Virtual & VIP Tours"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card 3 Description Text</label>
                <textarea
                  rows={3}
                  value={formData.feature3Desc}
                  onChange={(e) => handleChange('feature3Desc', e.target.value)}
                  placeholder="Experience high-definition live video walkthroughs or book private chauffeur-accompanied estate visits on your schedule."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SOCIAL MEDIA LINKS (Facebook, Instagram, YouTube, TikTok only) */}
        {activeSection === 'social' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Social Media Links (Facebook, Instagram, YouTube, TikTok)</h2>
              <p className="text-xs text-slate-500">Configure your official social media profile URLs. Small, clean icons will appear in the footer.</p>
            </div>

            {/* Facebook */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Facebook Page URL</span>
                  <span className="text-[10px] text-slate-400 ml-2">Appears in footer</span>
                </div>
              </div>
              <input
                type="url"
                value={formData.socialFacebook}
                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                placeholder="https://facebook.com/bightrealestate"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Instagram */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Instagram Profile URL</span>
                  <span className="text-[10px] text-slate-400 ml-2">Appears in footer</span>
                </div>
              </div>
              <input
                type="url"
                value={formData.socialInstagram}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/bightrealestate"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* YouTube */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">YouTube Channel URL</span>
                  <span className="text-[10px] text-slate-400 ml-2">Appears in footer</span>
                </div>
              </div>
              <input
                type="url"
                value={formData.socialYoutube}
                onChange={(e) => handleChange('socialYoutube', e.target.value)}
                placeholder="https://youtube.com/@bightrealestate"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            {/* TikTok */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center">
                  <TikTokIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">TikTok Profile URL</span>
                  <span className="text-[10px] text-slate-400 ml-2">Appears in footer</span>
                </div>
              </div>
              <input
                type="url"
                value={formData.socialTiktok}
                onChange={(e) => handleChange('socialTiktok', e.target.value)}
                placeholder="https://tiktok.com/@bightrealestate"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SECTION: FOOTER & COPYRIGHT */}
        {activeSection === 'footer' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Footer Text & Copyright Statement</h2>
              <p className="text-xs text-slate-500">Displayed in the bottom bar of every public marketplace page.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                placeholder="© 2026 Bight Real Estate."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Preset standard: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">© 2026 Bight Real Estate.</code>
              </p>
            </div>

            {/* Quick Links to Socials */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Linked Social Channels in Footer</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSection('social')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Manage Social Media Tab →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate text-slate-600 font-mono text-[11px]">{formData.socialFacebook || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <Instagram className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate text-slate-600 font-mono text-[11px]">{formData.socialInstagram || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="truncate text-slate-600 font-mono text-[11px]">{formData.socialYoutube || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <TikTokIcon className="w-4 h-4 text-slate-900 shrink-0" />
                  <span className="truncate text-slate-600 font-mono text-[11px]">{formData.socialTiktok || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Changes apply instantly to the public view and persist in local database.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Public Website Copy</span>
          </button>
        </div>

      </form>

    </div>
  );
};
