import React, { useState } from 'react';
import { CustomerUser } from '../../types';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Crown, 
  Save, 
  AlertCircle,
  FileText,
  Calendar,
  KeyRound
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { 
    customerList, 
    currentUser, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    toggleCustomerActive 
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerUser | null>(null);

  // Add Customer Form States - MANDATORY: Name, Email, Mobile, Password
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newLocation, setNewLocation] = useState('Islamabad, Pakistan');
  const [newBudget, setNewBudget] = useState('PKR 50M – 120M');
  const [newNotes, setNewNotes] = useState('');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Edit State password field
  const [editPassword, setEditPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isSuperadmin) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Superadmin Access Required</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Customer creation, account governance, and credential assignment are strictly governed by the Superadmin ({SUPERADMIN_EMAIL}).
        </p>
      </div>
    );
  }

  // Filter Customers
  const filteredCustomers = customerList.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.preferredLocation && c.preferredLocation.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate MANDATORY FIELDS
    if (!newName.trim()) {
      setErrorMessage('Full Legal Name is mandatory.');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMessage('A valid Email Address is mandatory.');
      return;
    }
    if (!newPhone.trim()) {
      setErrorMessage('Mobile Phone Number is mandatory.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Initial password must be at least 6 characters in length.');
      return;
    }

    const res = addCustomer({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      password: newPassword,
      preferredLocation: newLocation.trim(),
      budgetRange: newBudget.trim(),
      notes: newNotes.trim(),
      avatar: newAvatar,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to add customer.');
      return;
    }

    setSuccessMessage(`Customer account created successfully for ${newName}. They can now sign in using their mobile number (${newPhone}) or email with the initial password.`);
    setIsAddingCustomer(false);
    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setNewNotes('');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setErrorMessage(null);

    if (!editingCustomer.name.trim() || !editingCustomer.email.trim() || !editingCustomer.phone.trim()) {
      setErrorMessage('Name, email, and mobile number are mandatory fields.');
      return;
    }

    const updates: Partial<CustomerUser> & { password?: string } = {
      name: editingCustomer.name.trim(),
      email: editingCustomer.email.trim(),
      phone: editingCustomer.phone.trim(),
      preferredLocation: editingCustomer.preferredLocation,
      budgetRange: editingCustomer.budgetRange,
      notes: editingCustomer.notes,
    };

    if (editPassword.trim()) {
      if (editPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters in length.');
        return;
      }
      updates.password = editPassword;
    }

    const res = updateCustomer(editingCustomer.id, updates);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update customer.');
      return;
    }

    setSuccessMessage(`Customer profile for ${editingCustomer.name} updated successfully.`);
    setEditingCustomer(null);
    setEditPassword('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleConfirmDelete = () => {
    if (!customerToDelete) return;
    const res = deleteCustomer(customerToDelete.id);
    if (res.success) {
      setSuccessMessage(`Customer account for ${customerToDelete.name} was permanently removed.`);
    } else {
      setErrorMessage(res.error || 'Failed to delete customer.');
    }
    setCustomerToDelete(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Customer & Client Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-purple-700" /> Superadmin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governed by Superadmin ({SUPERADMIN_EMAIL}). Create, manage, and delete registered portal clients and prospective buyers.
          </p>
        </div>

        <button
          onClick={() => { setIsAddingCustomer(true); setErrorMessage(null); }}
          className="px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 self-stretch sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'active', 'inactive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === s ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400 ml-2">
            ({filteredCustomers.length} total)
          </span>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
              customer.status === 'active' ? 'border-slate-200 hover:border-amber-300' : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={customer.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 font-serif">{customer.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Private Client
                    </span>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleCustomerActive(customer.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    customer.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Toggle client active status"
                >
                  {customer.status}
                </button>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-900 font-semibold">{customer.phone}</span>
                </div>
                {customer.preferredLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500 truncate">{customer.preferredLocation}</span>
                  </div>
                )}
                {customer.budgetRange && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{customer.budgetRange}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="text-[11px] text-slate-500 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100 mb-3">
                  <span className="font-semibold text-amber-900 block mb-0.5">Advisory Notes:</span>
                  <p className="line-clamp-2">{customer.notes}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Joined: {customer.joinedDate}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditingCustomer(customer); setEditPassword(''); setErrorMessage(null); }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Edit customer details & password"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setCustomerToDelete(customer)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Delete customer permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 font-serif">No customers found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or add a new customer.</p>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold font-serif">Add New Customer Account</h2>
              </div>
              <button onClick={() => setIsAddingCustomer(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold block">Mandatory Superadmin Provisioning:</span>
                Mobile Number, Name, Email, and Password are all required so the customer can log in using either their mobile or email.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="tariq@luxuryestates.pk"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+92 300 5550199"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password * <span className="text-[10px] text-slate-500 font-normal">(min 6 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Sector F-7, Islamabad"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. PKR 50M – 120M"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Notes / Preferences</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="High-net-worth investor looking for modern villa in Islamabad."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Create Customer Account
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-base font-bold font-serif">Edit Customer: {editingCustomer.name}</h2>
              <button onClick={() => setEditingCustomer(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reset Password (optional) <span className="text-[10px] text-slate-500 font-normal">Leave blank to keep existing password</span>
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password to override"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    value={editingCustomer.preferredLocation || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, preferredLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={editingCustomer.budgetRange || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, budgetRange: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Notes</label>
                <textarea
                  rows={2}
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Delete Customer Account?</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              Are you sure you want to permanently delete customer <strong>{customerToDelete.name}</strong> ({customerToDelete.email})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
