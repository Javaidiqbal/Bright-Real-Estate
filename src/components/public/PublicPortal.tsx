import React, { useState, useMemo } from 'react';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { FilterState, Property } from '../../types';
import { PublicHeader } from './PublicHeader';
import { HeroSearch } from './HeroSearch';
import { PropertyGrid } from './PropertyGrid';
import { PropertyDetailModal } from './PropertyDetailModal';
import { FavoritesDrawer } from './FavoritesDrawer';
import { MyInquiriesDrawer } from './MyInquiriesDrawer';
import { StandaloneMortgageModal } from './StandaloneMortgageModal';
import { ContactUsModal } from './ContactUsModal';
import { 
  ShieldCheck, 
  Award, 
  Globe, 
  ArrowRight, 
  Facebook, 
  Instagram, 
  Youtube,
  Crown,
  Edit3
} from 'lucide-react';

// Custom TikTok icon for sleek aesthetic consistency
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.75a8.28 8.28 0 0 0 4.91 1.6V6.9a4.85 4.85 0 0 1-1-.21z" />
  </svg>
);

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  listingType: 'all',
  category: 'all',
  minPrice: 0,
  maxPrice: 20000000,
  bedrooms: 'all',
  bathrooms: 'all',
  minSqft: 0,
  amenities: [],
  city: 'all',
  sortBy: 'featured',
};

export const PublicPortal: React.FC = () => {
  const { 
    selectedPropertyForDetail, 
    setSelectedPropertyForDetail,
    setInterface,
    setActiveStaffTab,
    isAuthenticated,
    currentUser,
    openAuthModal,
    properties,
    websiteContent
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isMortgageCalcOpen, setIsMortgageCalcOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleScrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // Only active/approved properties or those in portfolio
        if (prop.status === 'draft' && !prop.approvedBySuperadmin) return false;

        // Listing type filter
        if (filters.listingType !== 'all' && prop.listingType !== filters.listingType) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && prop.category !== filters.category) {
          return false;
        }

        // Price range filter
        if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
          return false;
        }

        // Bedrooms filter
        if (filters.bedrooms !== 'all') {
          const minBeds = parseInt(filters.bedrooms, 10);
          if (prop.bedrooms < minBeds) return false;
        }

        // Bathrooms filter
        if (filters.bathrooms !== 'all') {
          const minBaths = parseInt(filters.bathrooms, 10);
          if (prop.bathrooms < minBaths) return false;
        }

        // Amenities filter
        if (filters.amenities.length > 0) {
          const hasAll = filters.amenities.every(a => prop.amenities.includes(a));
          if (!hasAll) return false;
        }

        // Search Query filter (title, description, neighborhood, city, address, mls)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matches =
            prop.title.toLowerCase().includes(q) ||
            prop.address.toLowerCase().includes(q) ||
            prop.neighborhood.toLowerCase().includes(q) ||
            prop.city.toLowerCase().includes(q) ||
            prop.mlsNumber.toLowerCase().includes(q) ||
            prop.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
        }
        if (filters.sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price_desc') {
          return b.price - a.price;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
        }
        if (filters.sortBy === 'sqft_desc') {
          return b.sqft - a.sqft;
        }
        return 0;
      });
  }, [properties, filters]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Public Header */}
      <PublicHeader 
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenInquiries={() => setIsInquiriesOpen(true)}
        onOpenContactUs={() => setIsContactUsOpen(true)}
        onScrollToExplore={handleScrollToExplore}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero & Search Banner */}
        <HeroSearch 
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredProperties.length}
        />

        {/* Property Grid Listings */}
        <PropertyGrid 
          properties={filteredProperties}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
        />

        {/* Agency Advisory & Quality Guarantee Section */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
          {/* Header & Superadmin Quick Edit Button */}
          <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Agency Standards & Guarantees
            </div>

            {isSuperadmin && (
              <button
                onClick={() => {
                  setInterface('staff');
                  setActiveStaffTab('website_editor');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/60 transition-colors cursor-pointer"
                title="Edit these 3 cards and social links in Superadmin CMS"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Footer Cards & Socials (Superadmin)</span>
              </button>
            )}
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-850/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {websiteContent?.feature1Title || 'Curated Luxury Portfolio'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {websiteContent?.feature1Desc || 'Every residence in our portfolio undergoes a rigorous architectural evaluation and verified title audit before public curation.'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-850/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {websiteContent?.feature2Title || 'Fiduciary Advisory'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {websiteContent?.feature2Desc || 'Our licensed superadmin brokers and luxury advisors protect your interests across valuation, negotiation, and escrow closing.'}
              </p>
            </div>

            {/* Card 3 */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-850/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {websiteContent?.feature3Title || '4K Virtual & VIP Tours'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {websiteContent?.feature3Desc || 'Experience high-definition live video walkthroughs or book private chauffeur-accompanied estate visits on your schedule.'}
              </p>
            </div>
          </div>

          {/* Footer Bar: Copyright, Social Media Links, and Staff Access */}
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400">
            {/* Clean Copyright Text (No INC, No Broker License #01928400) */}
            <div className="font-medium text-center md:text-left">
              {websiteContent?.footerText || `© ${new Date().getFullYear()} Bight Real Estate.`}
            </div>

            {/* Social Media Links (Facebook, Instagram, YouTube, TikTok only) */}
            <div className="flex items-center gap-2.5">
              {websiteContent?.socialFacebook && (
                <a
                  href={websiteContent.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {websiteContent?.socialInstagram && (
                <a
                  href={websiteContent.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Follow us on Instagram"
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {websiteContent?.socialYoutube && (
                <a
                  href={websiteContent.socialYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="Subscribe on YouTube"
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}

              {websiteContent?.socialTiktok && (
                <a
                  href={websiteContent.socialTiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title="Follow us on TikTok"
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all shadow-xs"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Portal Switcher Button */}
            <button
              onClick={() => {
                if (isAuthenticated && (currentUser?.role === 'superadmin' || currentUser?.role === 'admin')) {
                  setInterface('staff');
                } else {
                  openAuthModal('login');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAuthenticated && (currentUser?.role === 'superadmin' || currentUser?.role === 'admin') ? 'Staff Admin Portal' : 'Agent & Staff Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </main>

      {/* Global Modals and Drawers */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          onClose={() => setSelectedPropertyForDetail(null)}
        />
      )}

      <FavoritesDrawer 
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)} 
        onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
      />

      <MyInquiriesDrawer 
        isOpen={isInquiriesOpen}
        onClose={() => setIsInquiriesOpen(false)} 
        onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
      />

      <StandaloneMortgageModal 
        isOpen={isMortgageCalcOpen}
        onClose={() => setIsMortgageCalcOpen(false)} 
      />

      <ContactUsModal
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />

    </div>
  );
};
