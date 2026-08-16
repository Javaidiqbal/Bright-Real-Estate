import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FilterState, Property } from '../../types';
import { PublicHeader } from './PublicHeader';
import { HeroSearch } from './HeroSearch';
import { PropertyGrid } from './PropertyGrid';
import { PropertyDetailModal } from './PropertyDetailModal';
import { FavoritesDrawer } from './FavoritesDrawer';
import { MyInquiriesDrawer } from './MyInquiriesDrawer';
import { StandaloneMortgageModal } from './StandaloneMortgageModal';
import { ShieldCheck, Award, Globe, ArrowRight } from 'lucide-react';

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
    isAuthenticated,
    currentUser,
    openAuthModal,
    properties
  } = useApp();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isMortgageCalcOpen, setIsMortgageCalcOpen] = useState(false);

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
        onOpenCalculator={() => setIsMortgageCalcOpen(true)}
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
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">Curated Luxury Portfolio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every residence in our portfolio undergoes a rigorous architectural evaluation and verified title audit before public curation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">Fiduciary Advisory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our licensed superadmin brokers and luxury advisors protect your interests across valuation, negotiation, and escrow closing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white">4K Virtual & VIP Tours</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Experience high-definition live video walkthroughs or book private chauffeur-accompanied estate visits on your schedule.
              </p>
            </div>
          </div>

          {/* Quick Staff Jump */}
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © {new Date().getFullYear()} Bight Real Estate Inc. • Broker License #01928400 • Equal Housing Opportunity.
            </div>

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

    </div>
  );
};
