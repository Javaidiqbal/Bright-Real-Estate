import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPropertyPrice, formatRupees } from '../../utils/formatters';
import { 
  Heart, 
  BedDouble, 
  Bath, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Eye
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookTour?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSelect,
  onBookTour 
}) => {
  const { favorites, toggleFavorite, staffList, incrementPropertyViews } = useApp();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const isFavorite = favorites.includes(property.id);
  const agent = staffList.find(s => s.id === property.assignedAgentId);

  const handleCardClick = () => {
    incrementPropertyViews(property.id);
    onSelect(property);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const formattedPrice = formatPropertyPrice(property.price, property.listingType);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={property.images[currentImgIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-amber-400 text-[11px] font-bold uppercase tracking-wider shadow-sm">
            {property.listingType === 'for_sale' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {property.status === 'pending' && (
            <span className="px-2.5 py-1 rounded-md bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
              Under Contract
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs transition-transform active:scale-90 z-10"
          title={isFavorite ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
        </button>

        {/* Image navigation arrows (on hover if multiple images) */}
        {property.images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImg}
              className="w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              className="w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom image indicator dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
            {property.images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImgIndex ? 'bg-white w-3.5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
              {formattedPrice}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {formatRupees(Math.round(property.price / property.sqft))} / sqft
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.address}, {property.neighborhood}, {property.city}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {property.tagline || property.description}
          </p>
        </div>

        {/* Specs & Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} <span className="font-normal text-slate-500">Beds</span></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} <span className="font-normal text-slate-500">Baths</span></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.sqft.toLocaleString()} <span className="font-normal text-slate-500">SqFt</span></span>
            </div>
          </div>

          {/* Agent Card + Quick Action */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
            {agent ? (
              <div className="flex items-center gap-2">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
                  {agent.name}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">Exclusive Agency</span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <span>Explore Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
