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
  MessageSquare
} from 'lucide-react';

export const WebsiteEditor: React.FC = () => {
  const { 
    currentUser, 
    websiteContent, 
    updateWebsiteContent,
    setInterface 
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [formData, setFormData] = useState<WebsiteContent>({ ...websiteContent });
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'contact' | 'features' | 'footer'>('hero');

  if (!isSuperadmin) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Superadmin Access Required</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Public website copywriting and content governance are strictly reserved for the Superadmin ({SUPERADMIN_EMAIL}).
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
    if (window.confirm('Reset all public website copy to agency default presets?')) {
      setFormData({ ...INITIAL_WEBSITE_CONTENT });
      updateWebsiteContent(INITIAL_WEBSITE_CONTENT);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Public Website CMS & Copy Editor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-purple-700" /> Superadmin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control over headlines, hero messaging, agency philosophy, and contact details displayed on the public marketplace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setInterface('public')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>View Public Site</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
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
            <span className="font-semibold">Public website text changes saved successfully and live on marketplace!</span>
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
          { id: 'features', label: 'Advisory Pillars', icon: Award },
          { id: 'footer', label: 'Footer & Disclaimer', icon: Globe },
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

        {/* SECTION: ADVISORY PILLARS */}
        {activeSection === 'features' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Advisory Guarantee Highlights</h2>
              <p className="text-xs text-slate-500">The 3 feature cards displayed above the website footer.</p>
            </div>

            {/* Pillar 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Pillar 1: Quality & Selection</span>
              </div>
              <input
                type="text"
                value={formData.feature1Title}
                onChange={(e) => handleChange('feature1Title', e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <textarea
                rows={2}
                value={formData.feature1Desc}
                onChange={(e) => handleChange('feature1Desc', e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            {/* Pillar 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Pillar 2: Fiduciary Governance</span>
              </div>
              <input
                type="text"
                value={formData.feature2Title}
                onChange={(e) => handleChange('feature2Title', e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <textarea
                rows={2}
                value={formData.feature2Desc}
                onChange={(e) => handleChange('feature2Desc', e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            {/* Pillar 3 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Pillar 3: Experience & VIP Tours</span>
              </div>
              <input
                type="text"
                value={formData.feature3Title}
                onChange={(e) => handleChange('feature3Title', e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <textarea
                rows={2}
                value={formData.feature3Desc}
                onChange={(e) => handleChange('feature3Desc', e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>
        )}

        {/* SECTION: FOOTER & LEGAL */}
        {activeSection === 'footer' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold font-serif text-slate-900">Footer Text & License Statement</h2>
              <p className="text-xs text-slate-500">Displayed at the bottom of every public view page.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Copyright & License Notice
              </label>
              <textarea
                rows={3}
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                placeholder="© Bight Real Estate Inc. • Broker License #PK-RE-019284 • Equal Housing Opportunity."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
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
