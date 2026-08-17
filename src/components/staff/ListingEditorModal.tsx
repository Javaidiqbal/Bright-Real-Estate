import React, { useState, useEffect } from 'react';
import { Property, PropertyCategory, PropertyStatus, ListingType } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Building2, 
  MapPin, 
  Coins, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  Check, 
  Eye, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { ALL_AMENITIES_LIST, PRESET_GALLERY_IMAGES } from '../../data/mockData';

interface ListingEditorModalProps {
  propertyToEdit?: Property | null;
  onClose: () => void;
}

export const ListingEditorModal: React.FC<ListingEditorModalProps> = ({
  propertyToEdit,
  onClose,
}) => {
  const { 
    addProperty, 
    updateProperty, 
    staffList, 
    currentStaffUser 
  } = useApp();

  const isSuperadmin = currentStaffUser?.role === 'superadmin';

  // Form State
  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [tagline, setTagline] = useState(propertyToEdit?.tagline || '');
  const [description, setDescription] = useState(propertyToEdit?.description || '');
  const [listingType, setListingType] = useState<ListingType>(propertyToEdit?.listingType || 'for_sale');
  const [category, setCategory] = useState<PropertyCategory>(propertyToEdit?.category || 'single_family');
  const [price, setPrice] = useState<number>(propertyToEdit?.price || 2850000);
  const [address, setAddress] = useState(propertyToEdit?.address || '120 Marina Blvd');
  const [city, setCity] = useState(propertyToEdit?.city || 'San Francisco');
  const [state, setState] = useState(propertyToEdit?.state || 'CA');
  const [zipCode, setZipCode] = useState(propertyToEdit?.zipCode || '94123');
  const [neighborhood, setNeighborhood] = useState(propertyToEdit?.neighborhood || 'Marina District');
  const [bedrooms, setBedrooms] = useState<number>(propertyToEdit?.bedrooms || 4);
  const [bathrooms, setBathrooms] = useState<number>(propertyToEdit?.bathrooms || 3.5);
  const [sqft, setSqft] = useState<number>(propertyToEdit?.sqft || 3200);
  const [yearBuilt, setYearBuilt] = useState<number>(propertyToEdit?.yearBuilt || 2023);
  const [garageSpaces, setGarageSpaces] = useState<number>(propertyToEdit?.garageSpaces || 2);
  const [hoaFeeMonthly, setHoaFeeMonthly] = useState<number>(propertyToEdit?.hoaFeeMonthly || 0);
  const [status, setStatus] = useState<PropertyStatus>(propertyToEdit?.status || 'active');
  const [assignedAgentId, setAssignedAgentId] = useState(propertyToEdit?.assignedAgentId || (currentStaffUser?.id || 'staff-1'));
  const [images, setImages] = useState<string[]>(
    propertyToEdit?.images && propertyToEdit.images.length > 0 
      ? propertyToEdit.images 
      : [PRESET_GALLERY_IMAGES[0].url, PRESET_GALLERY_IMAGES[1].url]
  );
  const [amenities, setAmenities] = useState<string[]>(
    propertyToEdit?.amenities && propertyToEdit.amenities.length > 0
      ? propertyToEdit.amenities
      : ['Smart Home Automation', 'Custom Chef Kitchen', 'Secured Parking', 'Panoramic Ocean & Bridge Views']
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  // AI Copy Generation Simulation
  const handleGenerateAICopy = () => {
    setIsGeneratingCopy(true);
    setTimeout(() => {
      const generatedTagline = `Bespoke ${category.replace('_', ' ')} showcasing state-of-the-art architecture, luminous living spaces, and bespoke finishes in prime ${neighborhood}.`;
      const generatedDesc = `Impeccably situated in coveted ${neighborhood}, this extraordinary residence offers ${bedrooms} refined bedrooms, ${bathrooms} custom designer bathrooms, and ${sqft.toLocaleString()} square feet of light-filled architectural elegance. Designed with seamless indoor-outdoor entertaining flow, the property boasts high ceilings, a bespoke chef kitchen, custom millwork, smart climate automation, and an expansive private terrace with striking vistas. Minutes from premier dining, private schools, and coastal pathways.`;

      setTagline(generatedTagline);
      setDescription(generatedDesc);
      setIsGeneratingCopy(false);
    }, 600);
  };

  const handleAddPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim() && !images.includes(customImageUrl.trim())) {
      setImages(prev => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleAmenity = (item: string) => {
    setAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || price <= 0) return;

    const propertyPayload: Partial<Property> = {
      title,
      tagline: tagline || `Exquisite residence in ${neighborhood}`,
      description: description || `Welcome to ${title}, an exceptional property in ${neighborhood}.`,
      listingType,
      category,
      price: Number(price),
      address,
      city,
      state,
      zipCode,
      neighborhood,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      yearBuilt: Number(yearBuilt),
      garageSpaces: Number(garageSpaces),
      hoaFeeMonthly: Number(hoaFeeMonthly),
      propertyTaxAnnual: Math.round(Number(price) * 0.009),
      status,
      assignedAgentId,
      images: images.length > 0 ? images : [PRESET_GALLERY_IMAGES[0].url],
      amenities,
    };

    if (propertyToEdit) {
      updateProperty(propertyToEdit.id, propertyPayload);
    } else {
      addProperty(propertyPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif">
                {propertyToEdit ? `Edit Listing: ${propertyToEdit.title}` : 'Create New Luxury Listing'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Staff Publishing & Inventory System • RBAC Controlled
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Section 1: Basic Classification & Pricing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              1. General Details & Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Type *</label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as ListingType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="for_sale">For Sale</option>
                  <option value="for_rent">For Lease (Rental)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="luxury_villa">Luxury Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="single_family">Single Family Home</option>
                  <option value="modern_estate">Modern Estate</option>
                  <option value="condo">Condominium</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {listingType === 'for_sale' ? 'Listing Price (PKR) *' : 'Monthly Rent (PKR) *'}
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Crown Terrace at Pacific Heights"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Lead Agent *</label>
                <select
                  value={assignedAgentId}
                  onChange={(e) => setAssignedAgentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.toUpperCase()} - {s.title})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              2. Property Location & Neighborhood
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="2450 Vallejo Street"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Neighborhood *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Pacific Heights"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Architecture & Specs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              3. Specifications & Dimensions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  step={0.5}
                  min={1}
                  max={20}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Living SqFt</label>
                <input
                  type="number"
                  min={500}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year Built</label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Garage Cars</label>
                <input
                  type="number"
                  value={garageSpaces}
                  onChange={(e) => setGarageSpaces(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HOA Fee/Mo (PKR)</label>
                <input
                  type="number"
                  value={hoaFeeMonthly}
                  onChange={(e) => setHoaFeeMonthly(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Marketing Copy & AI Generator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Marketing Narrative & Description
              </h3>

              <button
                type="button"
                onClick={handleGenerateAICopy}
                disabled={isGeneratingCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{isGeneratingCopy ? 'Synthesizing Copy...' : 'AI Auto-Draft Narrative'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Highlight</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Architectural masterpiece with sweeping skyline horizons"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Comprehensive Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed architectural description, finishes, master suite, layout..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Section 5: Photography & Image Gallery */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              5. Photography & Image Gallery ({images.length} Selected)
            </h3>

            {/* Selected Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/80 text-amber-400 text-[9px] font-bold uppercase">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick 1-Click Preset Gallery Library */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-600 mb-2">
                1-Click Add from Curated Architecture Photo Presets:
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_GALLERY_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddPresetImage(preset.url)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-indigo-600" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL Form */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste external image URL: https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleAddCustomImage}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Section 6: Amenities Checklist */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              6. Features & Amenities Checklist
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_AMENITIES_LIST.map((item) => {
                const isSelected = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`text-left p-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                      isSelected 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 7: Publication Status */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Publication Status
                </label>
                <p className="text-[11px] text-slate-500">
                  {status === 'active' 
                    ? 'Listing is publicly visible and searchable on the marketplace.' 
                    : 'Draft or pending listing under internal review.'}
                </p>
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
              >
                <option value="active">Active (Public Marketplace)</option>
                <option value="pending">Under Contract / Pending</option>
                <option value="draft">Internal Draft</option>
                <option value="sold">Closed / Sold</option>
              </select>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{propertyToEdit ? 'Save Changes' : 'Publish Listing'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
