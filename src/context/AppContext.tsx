import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  StaffUser, 
  LeadInquiry, 
  AuditLog, 
  UserRole, 
  LeadStatus, 
  PropertyStatus,
  AuthUser
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_STAFF, 
  INITIAL_LEADS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

export const SUPERADMIN_EMAIL = 'ijavaid91@gmail.com';

interface AppContextType {
  // Authentication State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  signup: (name: string, email: string, rolePreference?: 'client' | 'admin', phone?: string, password?: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => void;

  // Navigation & Role State
  currentInterface: 'public' | 'staff';
  setInterface: (ui: 'public' | 'staff') => void;
  currentUserRole: UserRole;
  currentStaffUser: StaffUser | null;
  staffList: StaffUser[];
  
  // Properties State & Actions
  properties: Property[];
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  addProperty: (propertyData: Partial<Property>) => Property;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;
  approveProperty: (propertyId: string) => void;
  incrementPropertyViews: (propertyId: string) => void;
  
  // Leads & Inquiries CRM
  leads: LeadInquiry[];
  myPublicInquiries: LeadInquiry[];
  submitLeadInquiry: (data: Omit<LeadInquiry, 'id' | 'createdAt' | 'status' | 'internalNotes'>) => LeadInquiry;
  updateLeadStatus: (leadId: string, status: LeadStatus, note?: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  assignLeadAgent: (leadId: string, agentId: string) => void;

  // Staff Management (Superadmin)
  addStaffMember: (data: Omit<StaffUser, 'id' | 'totalDealsClosed' | 'salesVolume' | 'activeListingsCount' | 'joinedDate'>) => void;
  updateStaffMember: (staffId: string, updates: Partial<StaffUser>) => void;
  toggleStaffActive: (staffId: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (actionType: AuditLog['actionType'], description: string, targetId?: string) => void;

  // Utilities & Modals
  selectedPropertyForDetail: Property | null;
  setSelectedPropertyForDetail: (property: Property | null) => void;
  activeStaffTab: 'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'analytics' | 'audit';
  setActiveStaffTab: (tab: 'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'analytics' | 'audit') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'bight_auth_user_v2',
  PROPERTIES: 'bight_properties_v2',
  STAFF: 'bight_staff_v2',
  LEADS: 'bight_leads_v2',
  AUDIT: 'bight_audit_v2',
  FAVORITES: 'bight_favorites_v2',
  MY_INQUIRIES: 'bight_my_inquiries_v2',
  CURRENT_UI: 'bight_current_ui_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const [staffList, setStaffList] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Ensure superadmin ijavaid91@gmail.com is present
        const hasIjaz = parsed.some((s: StaffUser) => s.email.toLowerCase() === SUPERADMIN_EMAIL);
        if (!hasIjaz) {
          return [INITIAL_STAFF[0], ...parsed];
        }
        return parsed; 
      } catch (e) { console.error(e); }
    }
    return INITIAL_STAFF;
  });

  const [currentInterface, setCurrentInterface] = useState<'public' | 'staff'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_UI);
    if (saved === 'staff' || saved === 'public') return saved;
    return 'public';
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROPERTIES;
  });

  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEADS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['prop-1'];
  });

  const [myPublicInquiries, setMyPublicInquiries] = useState<LeadInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MY_INQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [activeStaffTab, setActiveStaffTab] = useState<'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'analytics' | 'audit'>('dashboard');

  // Persistence to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_UI, currentInterface);
  }, [currentInterface]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MY_INQUIRIES, JSON.stringify(myPublicInquiries));
  }, [myPublicInquiries]);

  // Derived current staff user
  const currentStaffUser: StaffUser | null = React.useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.role === 'superadmin' || currentUser.role === 'admin') {
      const match = staffList.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase());
      if (match) return match;
      // Fallback if not found in staffList
      return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role === 'superadmin' ? 'superadmin' : 'admin',
        title: currentUser.title || (currentUser.role === 'superadmin' ? 'Superadmin Executive' : 'Licensed Real Estate Advisor'),
        phone: currentUser.phone || '+92 300 1234567',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        licenseNumber: 'PK-RE #01948201',
        commissionRate: 2.5,
        activeListingsCount: 4,
        totalDealsClosed: 20,
        salesVolume: 15000000,
        isActive: true,
        joinedDate: currentUser.createdAt.split('T')[0],
      };
    }
    return null;
  }, [currentUser, staffList]);

  const currentUserRole: UserRole = currentUser ? currentUser.role : 'public';

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Helper to determine role based on email rule: ijavaid91@gmail.com is strictly Superadmin
  const determineRole = (email: string, requestedRole?: 'client' | 'admin'): 'superadmin' | 'admin' | 'client' => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === SUPERADMIN_EMAIL) {
      return 'superadmin';
    }
    // Check if email exists in staff list
    const staffMatch = staffList.find(s => s.email.toLowerCase() === normalizedEmail);
    if (staffMatch) {
      return staffMatch.role === 'superadmin' && normalizedEmail === SUPERADMIN_EMAIL ? 'superadmin' : 'admin';
    }
    if (requestedRole === 'admin') {
      return 'admin';
    }
    return 'client';
  };

  // Login handler
  const login = async (email: string, password?: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const role = determineRole(normalizedEmail);
    const existingStaff = staffList.find(s => s.email.toLowerCase() === normalizedEmail);

    const user: AuthUser = {
      id: existingStaff?.id || `user-${Date.now()}`,
      name: existingStaff?.name || (normalizedEmail === SUPERADMIN_EMAIL ? 'Ijaz Javaid' : normalizedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      email: normalizedEmail,
      role: role,
      avatar: existingStaff?.avatar || (role === 'superadmin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : role === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'),
      phone: existingStaff?.phone || '+92 300 1234567',
      title: existingStaff?.title || (role === 'superadmin' ? 'Superadmin Broker' : role === 'admin' ? 'Real Estate Advisor' : 'Registered Client'),
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    closeAuthModal();

    // Portal differentiation after login
    if (role === 'superadmin' || role === 'admin') {
      setCurrentInterface('staff');
      setActiveStaffTab('dashboard');
    } else {
      setCurrentInterface('public');
    }

    addAuditLog('system_settings', `User logged in: ${user.name} (${user.email}) as ${user.role.toUpperCase()}`, user.id);
    return { success: true, user };
  };

  // Sign up handler
  const signup = async (
    name: string, 
    email: string, 
    rolePreference: 'client' | 'admin' = 'client', 
    phone?: string, 
    password?: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !name.trim()) {
      return { success: false, error: 'Please provide both your full name and email.' };
    }

    const role = determineRole(normalizedEmail, rolePreference);

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: role,
      avatar: role === 'superadmin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : role === 'admin' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      phone: phone?.trim() || '+92 300 1234567',
      title: role === 'superadmin' ? 'Superadmin Broker' : role === 'admin' ? 'Executive Advisor' : 'Verified Buyer/Tenant',
      createdAt: new Date().toISOString(),
    };

    // If signed up as admin or superadmin and not in staffList, add them
    if (role === 'admin' || role === 'superadmin') {
      const existsInStaff = staffList.some(s => s.email.toLowerCase() === normalizedEmail);
      if (!existsInStaff) {
        const newStaff: StaffUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: role === 'superadmin' ? 'superadmin' : 'admin',
          title: user.title || 'Executive Advisor',
          phone: user.phone || '+92 300 1234567',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          licenseNumber: `PK-RE #${Math.floor(1000000 + Math.random() * 9000000)}`,
          commissionRate: 2.5,
          activeListingsCount: 0,
          totalDealsClosed: 0,
          salesVolume: 0,
          isActive: true,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        setStaffList(prev => [...prev, newStaff]);
      }
    }

    setCurrentUser(user);
    closeAuthModal();

    // Portal differentiation after login/signup
    if (role === 'superadmin' || role === 'admin') {
      setCurrentInterface('staff');
      setActiveStaffTab('dashboard');
    } else {
      setCurrentInterface('public');
    }

    addAuditLog('system_settings', `New user registered: ${user.name} (${user.email}) as ${user.role.toUpperCase()}`, user.id);
    return { success: true, user };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('system_settings', `User signed out: ${currentUser.name} (${currentUser.email})`, currentUser.id);
    }
    setCurrentUser(null);
    setCurrentInterface('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addAuditLog = (actionType: AuditLog['actionType'], description: string, targetId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'guest_visitor',
      userName: currentUser?.name || 'Guest Visitor',
      userRole: (currentUser?.role === 'superadmin' || currentUser?.role === 'admin') ? currentUser.role : 'admin',
      actionType,
      description,
      targetId,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const setInterface = (ui: 'public' | 'staff') => {
    setCurrentInterface(ui);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(propertyId);
      const next = isFav ? prev.filter(id => id !== propertyId) : [...prev, propertyId];
      // update property count
      setProperties(pList => pList.map(p => {
        if (p.id === propertyId) {
          return { ...p, favoritesCount: Math.max(0, p.favoritesCount + (isFav ? -1 : 1)) };
        }
        return p;
      }));
      return next;
    });
  };

  const incrementPropertyViews = (propertyId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, viewsCount: p.viewsCount + 1 };
      }
      return p;
    }));
  };

  const addProperty = (propertyData: Partial<Property>): Property => {
    const newId = `prop-${Date.now()}`;
    const mlsNum = `ML819${Math.floor(10000 + Math.random() * 90000)}`;
    const newProp: Property = {
      id: newId,
      title: propertyData.title || 'Untitled Luxury Listing',
      tagline: propertyData.tagline || 'Exquisite residence with premium finishes',
      description: propertyData.description || 'Welcome to this exceptional property offering refined architecture and sophisticated amenities.',
      listingType: propertyData.listingType || 'for_sale',
      category: propertyData.category || 'single_family',
      price: propertyData.price || 15000000,
      rentalPeriod: propertyData.rentalPeriod || 'monthly',
      address: propertyData.address || 'Block 5, Clifton',
      city: propertyData.city || 'Karachi',
      state: propertyData.state || 'Sindh',
      zipCode: propertyData.zipCode || '75600',
      neighborhood: propertyData.neighborhood || 'Clifton',
      bedrooms: propertyData.bedrooms || 3,
      bathrooms: propertyData.bathrooms || 2,
      sqft: propertyData.sqft || 2400,
      lotSizeSqft: propertyData.lotSizeSqft || 5000,
      yearBuilt: propertyData.yearBuilt || 2023,
      garageSpaces: propertyData.garageSpaces || 2,
      hoaFeeMonthly: propertyData.hoaFeeMonthly || 0,
      propertyTaxAnnual: propertyData.propertyTaxAnnual || Math.round((propertyData.price || 15000000) * 0.009),
      status: propertyData.status || 'draft',
      featured: propertyData.featured || false,
      images: propertyData.images && propertyData.images.length > 0 
        ? propertyData.images 
        : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80'],
      amenities: propertyData.amenities || ['Smart Home Automation', 'Custom Chef Kitchen', 'Secured Parking'],
      assignedAgentId: propertyData.assignedAgentId || (currentStaffUser?.id || 'staff-1'),
      mlsNumber: mlsNum,
      virtualTourUrl: propertyData.virtualTourUrl,
      viewsCount: 1,
      favoritesCount: 0,
      inquiriesCount: 0,
      dateListed: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      approvedBySuperadmin: currentUser?.role === 'superadmin' ? true : false,
    };

    setProperties(prev => [newProp, ...prev]);
    // update staff active listings count
    setStaffList(prev => prev.map(s => s.id === newProp.assignedAgentId ? { ...s, activeListingsCount: s.activeListingsCount + 1 } : s));

    addAuditLog('property_created', `Added new listing "${newProp.title}" (PKR ${newProp.price.toLocaleString()})`, newProp.id);
    return newProp;
  };

  const updateProperty = (propertyId: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updated = { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
        return updated;
      }
      return p;
    }));

    addAuditLog('property_updated', `Updated details for listing ID: ${propertyId}`, propertyId);
  };

  const deleteProperty = (propertyId: string) => {
    const target = properties.find(p => p.id === propertyId);
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    if (target) {
      setStaffList(prev => prev.map(s => s.id === target.assignedAgentId ? { ...s, activeListingsCount: Math.max(0, s.activeListingsCount - 1) } : s));
      addAuditLog('property_deleted', `Deleted listing "${target.title}"`, propertyId);
    }
  };

  const approveProperty = (propertyId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, approvedBySuperadmin: true, status: 'active', lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return p;
    }));
    addAuditLog('status_changed', `Superadmin approved listing publication for ID: ${propertyId}`, propertyId);
  };

  const submitLeadInquiry = (data: Omit<LeadInquiry, 'id' | 'createdAt' | 'status' | 'internalNotes'>): LeadInquiry => {
    const newLead: LeadInquiry = {
      ...data,
      id: `lead-${Date.now()}`,
      status: 'new',
      internalNotes: [],
      createdAt: new Date().toISOString(),
    };

    setLeads(prev => [newLead, ...prev]);
    setMyPublicInquiries(prev => [newLead, ...prev]);

    // increment inquiriesCount on the property
    if (data.propertyId) {
      setProperties(prev => prev.map(p => {
        if (p.id === data.propertyId) {
          return { ...p, inquiriesCount: p.inquiriesCount + 1 };
        }
        return p;
      }));
    }

    addAuditLog(
      'lead_updated', 
      `New ${data.leadType === 'tour_booking' ? 'Tour Booking Request' : 'Client Inquiry'} from ${data.clientName} (${data.clientEmail})`,
      newLead.id
    );

    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, note?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const notes = note ? [...l.internalNotes, `[${new Date().toLocaleDateString()}] ${note}`] : l.internalNotes;
        return { ...l, status, internalNotes: notes, lastContactedAt: new Date().toISOString() };
      }
      return l;
    }));

    addAuditLog('lead_updated', `Lead ID ${leadId} status changed to "${status}"`, leadId);
  };

  const addLeadNote = (leadId: string, note: string) => {
    const author = currentUser?.name || 'Staff';
    const noteEntry = `[${new Date().toLocaleDateString()} by ${author}]: ${note}`;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, internalNotes: [...l.internalNotes, noteEntry] };
      }
      return l;
    }));
  };

  const assignLeadAgent = (leadId: string, agentId: string) => {
    const agent = staffList.find(s => s.id === agentId);
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, assignedAgentId: agentId, assignedAgentName: agent?.name || 'Unassigned' };
      }
      return l;
    }));
    addAuditLog('lead_updated', `Reassigned lead ${leadId} to agent ${agent?.name}`, leadId);
  };

  const addStaffMember = (data: Omit<StaffUser, 'id' | 'totalDealsClosed' | 'salesVolume' | 'activeListingsCount' | 'joinedDate'>) => {
    const newStaff: StaffUser = {
      ...data,
      id: `staff-${Date.now()}`,
      activeListingsCount: 0,
      totalDealsClosed: 0,
      salesVolume: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStaffList(prev => [...prev, newStaff]);
    addAuditLog('staff_updated', `Added new team member ${newStaff.name} as ${newStaff.role.toUpperCase()}`, newStaff.id);
  };

  const updateStaffMember = (staffId: string, updates: Partial<StaffUser>) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, ...updates };
      }
      return s;
    }));
    addAuditLog('staff_updated', `Updated permissions/details for staff ID: ${staffId}`, staffId);
  };

  const toggleStaffActive = (staffId: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextState = !s.isActive;
        return { ...s, isActive: nextState };
      }
      return s;
    }));
    addAuditLog('staff_updated', `Toggled active status for staff ID: ${staffId}`, staffId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        currentInterface,
        setInterface,
        currentUserRole,
        currentStaffUser,
        staffList,
        properties,
        favorites,
        toggleFavorite,
        addProperty,
        updateProperty,
        deleteProperty,
        approveProperty,
        incrementPropertyViews,
        leads,
        myPublicInquiries,
        submitLeadInquiry,
        updateLeadStatus,
        addLeadNote,
        assignLeadAgent,
        addStaffMember,
        updateStaffMember,
        toggleStaffActive,
        auditLogs,
        addAuditLog,
        selectedPropertyForDetail,
        setSelectedPropertyForDetail,
        activeStaffTab,
        setActiveStaffTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
