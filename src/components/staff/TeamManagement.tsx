import React, { useState } from 'react';
import { StaffUser } from '../../types';
import { useApp, SUPERADMIN_EMAIL } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Lock, 
  DollarSign, 
  Percent, 
  Phone, 
  Mail, 
  Edit3, 
  UserCheck,
  Award,
  X,
  Save,
  Crown
} from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const { 
    staffList, 
    currentUser,
    addStaffMember, 
    updateStaffMember, 
    toggleStaffActive 
  } = useApp();

  const isSuperadmin = currentUser?.role === 'superadmin' || currentUser?.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

  // New Staff Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'superadmin' | 'admin'>('admin');
  const [newTitle, setNewTitle] = useState('Luxury Property Advisor');
  const [newLicense, setNewLicense] = useState('PK-RE #02294811');
  const [newCommission, setNewCommission] = useState(2.5);
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

  if (!isSuperadmin) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto py-24">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-slate-900">Superadmin Access Required</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Team governance, role modifications (Superadmin / Admin), and commission tier settings are strictly restricted to the Superadmin ({SUPERADMIN_EMAIL}).
        </p>
      </div>
    );
  }

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addStaffMember({
      name: newName,
      email: newEmail,
      phone: newPhone || '+92 300 5550100',
      role: newEmail.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() ? 'superadmin' : newRole,
      title: newTitle,
      licenseNumber: newLicense,
      commissionRate: Number(newCommission),
      avatar: newAvatar,
      isActive: true,
    });

    setIsAddingMember(false);
    setNewName('');
    setNewEmail('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    updateStaffMember(editingStaff.id, {
      name: editingStaff.name,
      role: editingStaff.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() ? 'superadmin' : editingStaff.role,
      title: editingStaff.title,
      phone: editingStaff.phone,
      commissionRate: Number(editingStaff.commissionRate),
      licenseNumber: editingStaff.licenseNumber,
    });

    setEditingStaff(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Staff & RBAC Role Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-purple-700" /> Superadmin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governed by Superadmin ({SUPERADMIN_EMAIL}). Manage advisors, commissions, and access rights.
          </p>
        </div>

        <button
          onClick={() => setIsAddingMember(true)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Staff Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {staffList.map((staff) => {
          const isPrimarySuperadmin = staff.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between ${
                isPrimarySuperadmin ? 'border-purple-300 ring-1 ring-purple-100' : staff.isActive ? 'border-slate-200 hover:border-amber-300' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                {/* Top row: Avatar, Name, Role badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 font-serif">{staff.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          staff.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}>
                          {staff.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{staff.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{staff.licenseNumber}</p>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => !isPrimarySuperadmin && toggleStaffActive(staff.id)}
                    disabled={isPrimarySuperadmin}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isPrimarySuperadmin
                        ? 'bg-purple-50 text-purple-700 cursor-default'
                        : staff.isActive 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer' 
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer'
                    }`}
                    title={isPrimarySuperadmin ? 'Superadmin is always active' : 'Toggle active status'}
                  >
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Commission</span>
                    <strong className="text-slate-900 font-serif">{staff.commissionRate}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Listings</span>
                    <strong className="text-slate-900 font-serif">{staff.activeListingsCount} Active</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Sales Volume</span>
                    <strong className="text-slate-900 font-serif">PKR {(staff.salesVolume / 1000000).toFixed(1)}M</strong>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isPrimarySuperadmin ? 'font-bold text-purple-950' : ''}>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>
                </div>
              </div>

              {/* Superadmin Role Change & Edit Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">Role:</span>
                  {isPrimarySuperadmin ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                      Root Superadmin
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const newRole = staff.role === 'superadmin' ? 'admin' : 'superadmin';
                        updateStaffMember(staff.id, { role: newRole });
                      }}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        staff.role === 'superadmin'
                          ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
                      }`}
                      title="Click to toggle between Superadmin and Admin role"
                    >
                      Switch to {staff.role === 'superadmin' ? 'Admin' : 'Superadmin'}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setEditingStaff(staff)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Staff Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold font-serif">Add New Staff / Advisor</h2>
              </div>
              <button onClick={() => setIsAddingMember(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Bilal Tariq"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="bilal.tariq@bightrealestate.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+92 300 5550182"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'superadmin' | 'admin')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="admin">Admin (Staff Agent)</option>
                    <option value="superadmin">Superadmin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Split (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={newCommission}
                    onChange={(e) => setNewCommission(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">License #</label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Create Member
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit Staff Member Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-base font-bold font-serif">Edit Advisor Details: {editingStaff.name}</h2>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role (RBAC)</label>
                  <select
                    value={editingStaff.role}
                    disabled={editingStaff.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as 'superadmin' | 'admin' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold disabled:bg-slate-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={editingStaff.commissionRate}
                    onChange={(e) => setEditingStaff({ ...editingStaff, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editingStaff.title}
                  onChange={(e) => setEditingStaff({ ...editingStaff, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
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

    </div>
  );
};
