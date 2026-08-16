import React, { useState } from 'react';
import { Property, PropertyStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  MoreVertical,
  ExternalLink,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { ListingEditorModal } from './ListingEditorModal';
import { formatPropertyPrice } from '../../utils/formatters';

export const ListingsManagement: React.FC = () => {
  const { 
    properties, 
    staffList, 
    currentStaffUser, 
    updateProperty, 
    deleteProperty, 
    approveProperty,
    setSelectedPropertyForDetail 
  } = useApp();

  const isSuperadmin = currentStaffUser?.role === 'superadmin';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mlsNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || p.assignedAgentId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const handleQuickStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    updateProperty(propertyId, { status: newStatus });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Agency Listing Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {properties.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage property lifecycle, pricing, public visibility, and agent assignments
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address, neighborhood, MLS #, title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">All Statuses ({properties.length})</option>
            <option value="active">Active Marketplace</option>
            <option value="pending">Under Contract (Pending)</option>
            <option value="draft">Internal Draft</option>
            <option value="sold">Closed (Sold)</option>
          </select>
        </div>

        {/* Assigned Agent Filter */}
        <div className="w-full md:w-56">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">All Advisors / Agents</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Specs</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Performance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No listings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => {
                  const agent = staffList.find(s => s.id === property.assignedAgentId);

                  return (
                    <tr key={property.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Property Title & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedPropertyForDetail(property)}>
                              {property.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{property.address}, {property.neighborhood}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              MLS #{property.mlsNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold font-serif text-slate-900 whitespace-nowrap">
                        {formatPropertyPrice(property.price, property.listingType)}
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div>{property.bedrooms} beds • {property.bathrooms} baths</div>
                        <div className="text-[11px] text-slate-400">{property.sqft.toLocaleString()} sqft</div>
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {agent ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900 text-[11px]">{agent.name}</div>
                              <div className="text-[9px] text-slate-400 uppercase">{agent.role}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Performance (Views, Favs, Inquiries) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1" title="Marketplace Views">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {property.viewsCount}
                          </span>
                          <span className="flex items-center gap-1" title="Saved Favorites">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            {property.favoritesCount}
                          </span>
                          <span className="flex items-center gap-1" title="Client Inquiries">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                            {property.inquiriesCount}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={property.status}
                          onChange={(e) => handleQuickStatusChange(property.id, e.target.value as PropertyStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                            property.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : property.status === 'pending'
                              ? 'bg-orange-50 text-orange-800 border-orange-200'
                              : property.status === 'sold'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="draft">Draft</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Superadmin Approve Action */}
                          {isSuperadmin && property.status === 'draft' && (
                            <button
                              onClick={() => approveProperty(property.id)}
                              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors"
                              title="Superadmin: Approve & Publish"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Listing */}
                          <button
                            onClick={() => setEditingProperty(property)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Preview Public Detail Modal */}
                          <button
                            onClick={() => setSelectedPropertyForDetail(property)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Superadmin Delete */}
                          {isSuperadmin ? (
                            <button
                              onClick={() => setPropertyToDelete(property)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                              title="Superadmin: Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span 
                              className="p-1.5 text-slate-300 cursor-not-allowed" 
                              title="Deleting listings requires Superadmin role"
                            >
                              <Lock className="w-4 h-4" />
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {(isCreatingNew || editingProperty) && (
        <ListingEditorModal
          propertyToEdit={editingProperty}
          onClose={() => {
            setIsCreatingNew(false);
            setEditingProperty(null);
          }}
        />
      )}

      {/* Superadmin Delete Confirm Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Confirm Property Deletion</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete <strong>{propertyToDelete.title}</strong>? This action will remove the listing from public search and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProperty(propertyToDelete.id);
                  setPropertyToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
