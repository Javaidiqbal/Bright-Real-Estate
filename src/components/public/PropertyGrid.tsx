import React, { useState } from 'react';
import { Property, FilterState } from '../../types';
import { PropertyCard } from './PropertyCard';
import { 
  LayoutGrid, 
  List, 
  Sparkles, 
  Filter, 
  SearchX, 
  ArrowUpDown,
  Building,
  CheckCircle2
} from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectProperty,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Control Bar: Total Count, View Toggle, Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Exclusive Listings Portfolio
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Showing {properties.length} prime residences available in Northern California
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="featured">Featured & Curated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="sqft_desc">Living Area (SqFt)</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid / List */}
      {properties.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 mt-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">No matching residences found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            We couldn't find any properties matching your current filter criteria. Try adjusting your budget or amenity filters.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={`mt-8 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6 max-w-4xl mx-auto'
        }`}>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}

      {/* Curated Service Guarantee Callout */}
      <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Advisory Services
          </div>
          <h3 className="text-2xl font-bold font-serif">Looking for off-market or pocket listings?</h3>
          <p className="text-sm text-slate-300 max-w-xl mt-1">
            Our Senior Partners manage exclusive private estates and architectural landmarks not indexed on public registries. Contact our advisory team for confidential placement.
          </p>
        </div>
        <button
          onClick={() => {
            if (properties.length > 0) {
              onSelectProperty(properties[0]);
            }
          }}
          className="shrink-0 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:shadow-lg"
        >
          Inquire with Private Partner
        </button>
      </div>

    </section>
  );
};
