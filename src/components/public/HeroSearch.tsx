import React, { useState } from 'react';
import { FilterState, PropertyCategory } from '../../types';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Sparkles,
  X,
  ChevronDown,
  Check,
  Edit3
} from 'lucide-react';
import { ALL_AMENITIES_LIST } from '../../data/mockData';

interface HeroSearchProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const { websiteContent, currentUser, setInterface, setActiveStaffTab } = useApp();
  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'luxury_villa', label: 'Luxury Villas' },
    { id: 'penthouse', label: 'Penthouses' },
    { id: 'single_family', label: 'Single Family' },
    { id: 'modern_estate', label: 'Modern Estates' },
    { id: 'condo', label: 'Condominiums' },
    { id: 'townhouse', label: 'Townhouses' },
  ];

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    const next = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onFilterChange({ amenities: next });
  };

  const activeFiltersCount = [
    filters.listingType !== 'all',
    filters.category !== 'all',
    filters.minPrice > 0 || filters.maxPrice < 20000000,
    filters.bedrooms !== 'all',
    filters.bathrooms !== 'all',
    filters.amenities.length > 0,
    filters.searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Hero Copy - Dynamic from Website Content CMS */}
        <div className="text-center max-w-3xl mx-auto mb-8 relative">
          {isSuperadmin && (
            <div className="flex justify-center mb-3">
              <button
                onClick={() => {
                  setInterface('staff');
                  setActiveStaffTab('website_editor');
                }}
                className="px-3 py-1 bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Edit public website headlines & copy in Superadmin CMS"
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>Superadmin: Edit Public Copy</span>
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {websiteContent.heroTagline || 'Curated Architectural Residences & Estates'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white leading-tight">
            {websiteContent.heroHeading || 'Discover Exceptional Homes Tailored to Your Life'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {websiteContent.heroSubheading || 'Browse our exclusive portfolio of luxury residences, penthouses, and private estates. Connect with dedicated advisory partners for VIP tours.'}
          </p>
        </div>

        {/* Primary Search Container */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 max-w-5xl mx-auto">
          
          {/* Top Tabs: Listing Type */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2 flex-wrap">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onFilterChange({ listingType: 'all' })}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.listingType === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Properties
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ listingType: 'for_sale' })}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.listingType === 'for_sale'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ listingType: 'for_rent' })}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.listingType === 'for_rent'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Rent
              </button>
            </div>

            {/* Total count badge */}
            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <span>Showing <strong className="text-slate-900">{totalResults}</strong> matching residences</span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={onResetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline ml-1"
                >
                  Reset all ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* Core Search Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search Input (Keyword / Location) */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Location or Keyword
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  placeholder="Presidio, Marina, Pacific Heights, penthouse..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                />
                {filters.searchQuery && (
                  <button 
                    onClick={() => onFilterChange({ searchQuery: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Property Category */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Beds & Baths Quick */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">Any Beds</option>
                <option value="1">1+ Bed</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            {/* Toggle Filters Button */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  showAdvanced || activeFiltersCount > 0
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

          {/* Advanced Filters Expandable Drawer */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-200">
              
              {/* Max Price Slider / Inputs */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="uppercase text-[11px] text-slate-500">Max Budget</span>
                  <span className="text-amber-700 font-bold">
                    {filters.maxPrice >= 15000000
                      ? 'No Limit (PKR 15M+)'
                      : `PKR ${(filters.maxPrice / 1000000).toFixed(1)}M`}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={15000000}
                  step={250000}
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>PKR 500k</span>
                  <span>PKR 5M</span>
                  <span>PKR 10M</span>
                  <span>PKR 15M+</span>
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Bathrooms
                </label>
                <div className="flex items-center gap-1.5">
                  {['all', '1', '2', '3', '4+'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => onFilterChange({ bathrooms: b })}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        filters.bathrooms === b
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b === 'all' ? 'Any' : `${b} ba`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Sort Properties
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="featured">Featured & Curated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Recently Listed</option>
                  <option value="sqft_desc">Largest Living Area (Sq Ft)</option>
                </select>
              </div>

              {/* Amenities Multi-Select Tags (Span across) */}
              <div className="sm:col-span-2 lg:col-span-3 pt-2">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Key Amenities & Architectural Features
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_AMENITIES_LIST.slice(0, 10).map((amenity) => {
                    const isSelected = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
