import React from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { formatPropertyPrice } from '../../utils/formatters';
import { X, Heart, Trash2, ArrowRight, BedDouble, Bath, Maximize2 } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
}) => {
  const { favorites, properties, toggleFavorite } = useApp();

  if (!isOpen) return null;

  const favoriteProps = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h2 className="text-base font-bold font-serif">Saved Residences ({favoriteProps.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteProps.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Heart className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No Saved Properties Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the heart icon on any residence to bookmark it for comparison or quick booking.
              </p>
            </div>
          ) : (
            favoriteProps.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  onSelectProperty(prop);
                  onClose();
                }}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex gap-3.5 bg-slate-50/50 hover:bg-white"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-serif text-slate-900 truncate">
                        {formatPropertyPrice(prop.price, prop.listingType)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prop.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-medium text-slate-800 line-clamp-1 group-hover:text-amber-700">
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {prop.neighborhood}, {prop.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-semibold pt-1">
                    <span>{prop.bedrooms} beds</span>
                    <span>•</span>
                    <span>{prop.bathrooms} baths</span>
                    <span>•</span>
                    <span>{prop.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favoriteProps.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => {
                if (favoriteProps[0]) {
                  onSelectProperty(favoriteProps[0]);
                  onClose();
                }
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Review Primary Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
