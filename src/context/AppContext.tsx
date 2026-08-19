import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  StaffUser,
  CustomerUser,
  LeadInquiry,
  AuditLog,
  UserRole,
  LeadStatus,
  PropertyStatus,
  AuthUser,
  WebsiteContent,
  AttendanceRecord,
  AttendanceBreak,
  AttendanceStatus
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_ATTENDANCE
} from '../data/mockData';

export const SUPERADMIN_EMAIL = 'ijavaid91@gmail.com';

// Helper to normalize phone numbers for robust matching (e.g. +92 300 1234567 vs 03001234567)
export const normalizePhoneNumber = (phoneStr: string): string => {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  // If starts with 0 (e.g., 0300...), normalize to 92300...
  if (digits.startsWith('0') && digits.length === 11) {
    return '92' + digits.slice(1);
  }
  return digits;
};

interface AppContextType {
  // Authentication State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'forgot_password';
  openAuthModal: (tab?: 'login' | 'signup' | 'forgot_password') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  signup: (name: string, email: string, rolePreference?: 'client' | 'admin', phone?: string, password?: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string, authorizationCode?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPasswordReset: (email: string, authorizationCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: { name?: string; phone?: string; title?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
  sendEmailAuthorizationCode: (email: string, purpose: 'signup' | 'password_change' | 'password_recovery') => Promise<{ success: boolean; code: string; error?: string }>;
  verifyEmailAuthorizationCode: (email: string, code: string, purpose: 'signup' | 'password_change' | 'password_recovery') => { success: boolean; error?: string };

  // Account Settings Modal
  isAccountSettingsOpen: boolean;
  accountSettingsInitialTab: 'password' | 'profile';
  openAccountSettings: (initialTab?: 'password' | 'profile') => void;
  closeAccountSettings: () => void;

  // Navigation & Role State
  currentInterface: 'public' | 'staff';
  setInterface: (ui: 'public' | 'staff') => void;
  currentUserRole: UserRole;
  currentStaffUser: StaffUser | null;
  staffList: StaffUser[];
  customerList: CustomerUser[];

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
  addStaffMember: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: 'superadmin' | 'admin';
    title?: string;
    licenseNumber?: string;
    commissionRate?: number;
    avatar?: string;
  }) => { success: boolean; error?: string; staff?: StaffUser };
  updateStaffMember: (staffId: string, updates: Partial<StaffUser> & { password?: string }) => { success: boolean; error?: string };
  deleteStaffMember: (staffId: string) => { success: boolean; error?: string };
  toggleStaffActive: (staffId: string) => void;

  // Customer Management (Superadmin)
  addCustomer: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    preferredLocation?: string;
    budgetRange?: string;
    notes?: string;
    avatar?: string;
  }) => { success: boolean; error?: string; customer?: CustomerUser };
  updateCustomer: (customerId: string, updates: Partial<CustomerUser> & { password?: string }) => { success: boolean; error?: string };
  deleteCustomer: (customerId: string) => { success: boolean; error?: string };
  toggleCustomerActive: (customerId: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (actionType: AuditLog['actionType'], description: string, targetId?: string) => void;

  // Attendance System
  attendanceRecords: AttendanceRecord[];
  todayAttendanceRecord: AttendanceRecord | undefined;
  clockIn: (notes?: string) => { success: boolean; record?: AttendanceRecord; error?: string };
  clockOut: (notes?: string) => { success: boolean; record?: AttendanceRecord; error?: string };
  startBreak: (note?: string) => { success: boolean; error?: string };
  endBreak: () => { success: boolean; error?: string };
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; record?: AttendanceRecord; error?: string };
  updateAttendanceRecord: (recordId: string, updates: Partial<AttendanceRecord>, reason?: string) => { success: boolean; error?: string };
  deleteAttendanceRecord: (recordId: string) => { success: boolean; error?: string };

  // Utilities & Modals
  selectedPropertyForDetail: Property | null;
  setSelectedPropertyForDetail: (property: Property | null) => void;
  activeStaffTab: 'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'customers' | 'website_editor' | 'analytics' | 'audit' | 'attendance';
  setActiveStaffTab: (tab: 'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'customers' | 'website_editor' | 'analytics' | 'audit' | 'attendance') => void;

  // Website Content CMS (Superadmin editable)
  websiteContent: WebsiteContent;
  updateWebsiteContent: (updates: Partial<WebsiteContent>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'bight_auth_user_v2',
  USER_PASSWORDS: 'bight_user_passwords_v2',
  PROPERTIES: 'bight_properties_v2',
  STAFF: 'bight_staff_v2',
  CUSTOMERS: 'bight_customers_v2',
  LEADS: 'bight_leads_v2',
  AUDIT: 'bight_audit_v2',
  FAVORITES: 'bight_favorites_v2',
  MY_INQUIRIES: 'bight_my_inquiries_v2',
  CURRENT_UI: 'bight_current_ui_v2',
  WEBSITE_CONTENT: 'bight_website_content_v2',
  ATTENDANCE: 'bight_attendance_v2',
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

  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Initialize default credentials
    return {
      'ijavaid91@gmail.com': 'admin123',
      'marcus.chen@bightrealestate.com': 'admin123',
      'sarah.jenkins@bightrealestate.com': 'admin123',
      'david.ross@bightrealestate.com': 'admin123',
      'hamza.sheikh@gmail.com': 'client123',
      'fatima.alhassan@outlook.com': 'client123',
      'zainab.malik@luxuryestates.pk': 'client123',
    };
  });

  // Verification codes store: key = email.toLowerCase() + '_' + purpose
  const [activeVerificationCodes, setActiveVerificationCodes] = useState<Record<string, { code: string; expiresAt: number }>>({});

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot_password'>('login');

  // Account Settings Modal State
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [accountSettingsInitialTab, setAccountSettingsInitialTab] = useState<'password' | 'profile'>('password');

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

  const [customerList, setCustomerList] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { console.error(e); }
    }
    return INITIAL_CUSTOMERS;
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
  const [activeStaffTab, setActiveStaffTab] = useState<'dashboard' | 'listings' | 'leads' | 'calendar' | 'team' | 'customers' | 'website_editor' | 'analytics' | 'audit' | 'attendance'>('dashboard');

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ATTENDANCE;
  });

  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEBSITE_CONTENT);
    if (saved) {
      try { return { ...INITIAL_WEBSITE_CONTENT, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
    }
    return INITIAL_WEBSITE_CONTENT;
  });

  const updateWebsiteContent = (updates: Partial<WebsiteContent>) => {
    setWebsiteContent(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.WEBSITE_CONTENT, JSON.stringify(next));
      return next;
    });
    addAuditLog('system_settings', 'Superadmin updated public website content & copy configuration.');
  };

  // Persistence to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_UI, currentInterface);
  }, [currentInterface]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customerList));
  }, [customerList]);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(userPasswords));
  }, [userPasswords]);

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
        joinedDate: currentUser.createdAt ? currentUser.createdAt.split('T')[0] : '2023-01-01',
      };
    }
    return null;
  }, [currentUser, staffList]);

  const currentUserRole: UserRole = currentUser ? currentUser.role : 'public';

  const openAuthModal = (tab: 'login' | 'signup' | 'forgot_password' = 'login') => {
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
      return staffMatch.role === 'superadmin' && normalizedEmail === SUPERADMIN_EMAIL ? 'superadmin' : staffMatch.role;
    }
    if (requestedRole === 'admin') {
      return 'admin';
    }
    return 'client';
  };

  // Login handler supporting Email Address OR Mobile Number
  const login = async (identifier: string, password?: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      return { success: false, error: 'Please enter your email address or mobile number.' };
    }

    const normalizedEmail = cleanIdentifier.toLowerCase();
    const normalizedPhoneDigits = normalizePhoneNumber(cleanIdentifier);

    // 1. Check if identifier matches Staff
    let matchedStaff = staffList.find(s => {
      if (s.email.toLowerCase() === normalizedEmail) return true;
      if (normalizedPhoneDigits && normalizePhoneNumber(s.phone) === normalizedPhoneDigits) return true;
      return false;
    });

    // 2. Check if identifier matches Customer
    let matchedCustomer = !matchedStaff ? customerList.find(c => {
      if (c.email.toLowerCase() === normalizedEmail) return true;
      if (normalizedPhoneDigits && normalizePhoneNumber(c.phone) === normalizedPhoneDigits) return true;
      return false;
    }) : undefined;

    // Check if root superadmin by email
    const isRootSuperadmin = normalizedEmail === SUPERADMIN_EMAIL;

    let targetEmail = normalizedEmail;
    let targetRole: 'superadmin' | 'admin' | 'client' = 'client';
    let targetName = cleanIdentifier;
    let targetPhone = cleanIdentifier;
    let targetAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
    let targetTitle = 'Registered Client';
    let targetId = `user-${Date.now()}`;

    if (isRootSuperadmin) {
      targetEmail = SUPERADMIN_EMAIL;
      targetRole = 'superadmin';
      targetName = matchedStaff?.name || 'Ijaz Javaid';
      targetPhone = matchedStaff?.phone || '+92 300 1234567';
      targetAvatar = matchedStaff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      targetTitle = 'Managing Principal & Superadmin Broker';
      targetId = matchedStaff?.id || 'staff-1';
    } else if (matchedStaff) {
      targetEmail = matchedStaff.email.toLowerCase();
      targetRole = matchedStaff.role;
      targetName = matchedStaff.name;
      targetPhone = matchedStaff.phone;
      targetAvatar = matchedStaff.avatar;
      targetTitle = matchedStaff.title;
      targetId = matchedStaff.id;

      if (!matchedStaff.isActive) {
        return { success: false, error: 'Your staff account is currently deactivated. Please contact the Superadmin.' };
      }
    } else if (matchedCustomer) {
      targetEmail = matchedCustomer.email.toLowerCase();
      targetRole = 'client';
      targetName = matchedCustomer.name;
      targetPhone = matchedCustomer.phone;
      targetAvatar = matchedCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
      targetTitle = 'Verified Luxury Client';
      targetId = matchedCustomer.id;

      if (matchedCustomer.status === 'inactive') {
        return { success: false, error: 'Your customer account is currently inactive. Please contact support.' };
      }
    } else {
      // If it looks like an email, we allow fallback client auto-generation with given password
      if (normalizedEmail.includes('@')) {
        targetEmail = normalizedEmail;
        targetRole = determineRole(normalizedEmail);
        targetName = normalizedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        targetPhone = '+92 300 1234567';
      } else {
        return { success: false, error: 'No account found matching this mobile number or email. Please check your credentials or register.' };
      }
    }

    // Password verification check
    const storedPw = userPasswords[targetEmail] || (normalizedPhoneDigits ? userPasswords[normalizedPhoneDigits] : undefined);
    if (storedPw && password !== undefined) {
      if (storedPw.trim() !== '' && storedPw !== password.trim()) {
        return { success: false, error: 'Invalid password. Please check your credentials or use Forgot Password.' };
      }
    } else if (password && password.trim()) {
      // Record initial password for this email and phone
      setUserPasswords(prev => ({
        ...prev,
        [targetEmail]: password.trim(),
        ...(normalizedPhoneDigits ? { [normalizedPhoneDigits]: password.trim() } : {})
      }));
    }

    const user: AuthUser = {
      id: targetId,
      name: targetName,
      email: targetEmail,
      role: targetRole,
      avatar: targetAvatar,
      phone: targetPhone,
      title: targetTitle,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    closeAuthModal();

    // Portal differentiation after login
    if (targetRole === 'superadmin' || targetRole === 'admin') {
      setCurrentInterface('staff');
      setActiveStaffTab('dashboard');
    } else {
      setCurrentInterface('public');
    }

    addAuditLog('system_settings', `User logged in: ${user.name} (${user.email} / ${user.phone}) as ${user.role.toUpperCase()}`, user.id);
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

    if (!phone || !phone.trim()) {
      return { success: false, error: 'Mobile number is required.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password is required and must be at least 6 characters in length.' };
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
      phone: phone.trim(),
      title: role === 'superadmin' ? 'Superadmin Broker' : role === 'admin' ? 'Executive Advisor' : 'Verified Client',
      createdAt: new Date().toISOString(),
    };

    const phoneDigits = normalizePhoneNumber(phone);
    setUserPasswords(prev => ({
      ...prev,
      [normalizedEmail]: password.trim(),
      ...(phoneDigits ? { [phoneDigits]: password.trim() } : {})
    }));

    // If client, also add to customerList if not already present
    if (role === 'client') {
      const existsInCustomers = customerList.some(c => c.email.toLowerCase() === normalizedEmail);
      if (!existsInCustomers) {
        const newCustomer: CustomerUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || phone.trim(),
          role: 'client',
          avatar: user.avatar,
          status: 'active',
          joinedDate: new Date().toISOString().split('T')[0],
          inquiriesCount: 0,
        };
        setCustomerList(prev => [newCustomer, ...prev]);
      }
    }

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
          phone: user.phone || phone.trim(),
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

    addAuditLog('system_settings', `New user registered: ${user.name} (${user.email} / ${user.phone}) as ${user.role.toUpperCase()}`, user.id);
    return { success: true, user };
  };

  // Send Email Authorization Code
  const sendEmailAuthorizationCode = async (
    email: string,
    purpose: 'signup' | 'password_change' | 'password_recovery'
  ): Promise<{ success: boolean; code: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, code: '', error: 'Please enter a valid email address.' };
    }

    // Generate 6-digit numeric verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    const key = `${cleanEmail}_${purpose}`;

    setActiveVerificationCodes(prev => ({
      ...prev,
      [key]: { code: generatedCode, expiresAt }
    }));

    addAuditLog(
      'system_settings',
      `Email authorization code dispatched for ${purpose.replace('_', ' ')}: ${cleanEmail}`,
      currentUser?.id || 'public_auth'
    );

    return { success: true, code: generatedCode };
  };

  // Verify Email Authorization Code
  const verifyEmailAuthorizationCode = (
    email: string,
    code: string,
    purpose: 'signup' | 'password_change' | 'password_recovery'
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const key = `${cleanEmail}_${purpose}`;
    const entry = activeVerificationCodes[key];

    if (!entry) {
      return {
        success: false,
        error: 'No active authorization code found for this email. Please request a new code.'
      };
    }

    if (Date.now() > entry.expiresAt) {
      return {
        success: false,
        error: 'The authorization code has expired. Please request a new code.'
      };
    }

    if (entry.code !== code.trim()) {
      return {
        success: false,
        error: 'Incorrect authorization code. Please verify the 6-digit code sent to your email.'
      };
    }

    // Invalidate code after successful single use
    setActiveVerificationCodes(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    return { success: true };
  };

  // Forgot Password / Password Recovery via Email ID
  const forgotPasswordReset = async (
    email: string,
    authorizationCode: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters in length.' };
    }

    const verifyRes = verifyEmailAuthorizationCode(cleanEmail, authorizationCode, 'password_recovery');
    if (!verifyRes.success) {
      return { success: false, error: verifyRes.error || 'Email authorization failed.' };
    }

    // Find if user has a matching phone to also update phone password key
    const staffMatch = staffList.find(s => s.email.toLowerCase() === cleanEmail);
    const customerMatch = customerList.find(c => c.email.toLowerCase() === cleanEmail);
    const phoneDigits = staffMatch ? normalizePhoneNumber(staffMatch.phone) : customerMatch ? normalizePhoneNumber(customerMatch.phone) : undefined;

    const updatedPasswords = {
      ...userPasswords,
      [cleanEmail]: newPassword,
      ...(phoneDigits ? { [phoneDigits]: newPassword } : {})
    };
    setUserPasswords(updatedPasswords);

    try {
      localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(updatedPasswords));
    } catch (e) {
      console.error(e);
    }

    addAuditLog('system_settings', `Password recovered and reset via email code for: ${cleanEmail}`, 'password_recovery');
    return { success: true };
  };

  // Change Password
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    authorizationCode?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    const emailKey = currentUser.email.toLowerCase();
    const storedPw = userPasswords[emailKey];

    // If an existing password was recorded, verify currentPassword matches
    if (storedPw && storedPw.trim() !== '' && storedPw !== currentPassword) {
      return { success: false, error: 'The current password you entered is incorrect.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters in length.' };
    }

    if (storedPw && storedPw === newPassword) {
      return { success: false, error: 'New password must be different from your current password.' };
    }

    // If authorization code provided, verify it
    if (authorizationCode !== undefined) {
      const verifyRes = verifyEmailAuthorizationCode(emailKey, authorizationCode, 'password_change');
      if (!verifyRes.success) {
        return { success: false, error: verifyRes.error || 'Email authorization failed.' };
      }
    }

    const phoneDigits = currentUser.phone ? normalizePhoneNumber(currentUser.phone) : undefined;
    const updatedPasswords = {
      ...userPasswords,
      [emailKey]: newPassword,
      ...(phoneDigits ? { [phoneDigits]: newPassword } : {})
    };
    setUserPasswords(updatedPasswords);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(updatedPasswords));
    } catch (e) {
      console.error(e);
    }

    addAuditLog('system_settings', `Password successfully updated by user: ${currentUser.name} (${currentUser.email})`, currentUser.id);
    return { success: true };
  };

  // Update User Profile
  const updateUserProfile = async (updates: { name?: string; phone?: string; title?: string; avatar?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'No active user session.' };
    }

    const updatedUser: AuthUser = {
      ...currentUser,
      name: updates.name?.trim() ? updates.name.trim() : currentUser.name,
      phone: updates.phone?.trim() ? updates.phone.trim() : currentUser.phone,
      title: updates.title?.trim() ? updates.title.trim() : currentUser.title,
      avatar: updates.avatar?.trim() ? updates.avatar.trim() : currentUser.avatar,
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    // Also update in staff list if applicable
    setStaffList(prev => prev.map(s => {
      if (s.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return {
          ...s,
          name: updatedUser.name,
          phone: updatedUser.phone || s.phone,
          title: updatedUser.title || s.title,
          avatar: updatedUser.avatar || s.avatar,
        };
      }
      return s;
    }));

    // Also update in customer list if applicable
    setCustomerList(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return {
          ...c,
          name: updatedUser.name,
          phone: updatedUser.phone || c.phone,
          avatar: updatedUser.avatar || c.avatar,
        };
      }
      return c;
    }));

    addAuditLog('system_settings', `Account profile updated for: ${updatedUser.name} (${updatedUser.email})`, currentUser.id);
    return { success: true };
  };

  const openAccountSettings = (initialTab: 'password' | 'profile' = 'password') => {
    setAccountSettingsInitialTab(initialTab);
    setIsAccountSettingsOpen(true);
  };

  const closeAccountSettings = () => {
    setIsAccountSettingsOpen(false);
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

  // Staff Management (Superadmin)
  const addStaffMember = (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: 'superadmin' | 'admin';
    title?: string;
    licenseNumber?: string;
    commissionRate?: number;
    avatar?: string;
  }): { success: boolean; error?: string; staff?: StaffUser } => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const password = data.password?.trim();

    if (!name) return { success: false, error: 'Staff member full name is mandatory.' };
    if (!email || !email.includes('@')) return { success: false, error: 'A valid email address is mandatory.' };
    if (!phone) return { success: false, error: 'Mobile number is mandatory.' };
    if (!password || password.length < 6) return { success: false, error: 'Password is mandatory (minimum 6 characters).' };

    // Check if staff email already registered
    const exists = staffList.some(s => s.email.toLowerCase() === email);
    if (exists) {
      return { success: false, error: 'A staff member with this email already exists in the system.' };
    }

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name,
      email,
      phone,
      role: email === SUPERADMIN_EMAIL ? 'superadmin' : (data.role || 'admin'),
      title: data.title?.trim() || (data.role === 'superadmin' ? 'Executive Partner' : 'Luxury Property Advisor'),
      licenseNumber: data.licenseNumber?.trim() || `PK-RE #${Math.floor(1000000 + Math.random() * 9000000)}`,
      commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : 2.5,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      activeListingsCount: 0,
      totalDealsClosed: 0,
      salesVolume: 0,
      isActive: true,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Store password
    const phoneDigits = normalizePhoneNumber(phone);
    setUserPasswords(prev => ({
      ...prev,
      [email]: password,
      ...(phoneDigits ? { [phoneDigits]: password } : {})
    }));

    setStaffList(prev => [newStaff, ...prev]);
    addAuditLog('staff_updated', `Superadmin added staff member: ${newStaff.name} (${newStaff.email}, Phone: ${newStaff.phone}) with role ${newStaff.role.toUpperCase()}`, newStaff.id);
    return { success: true, staff: newStaff };
  };

  const updateStaffMember = (staffId: string, updates: Partial<StaffUser> & { password?: string }): { success: boolean; error?: string } => {
    const target = staffList.find(s => s.id === staffId);
    if (!target) return { success: false, error: 'Staff member not found.' };

    const email = updates.email ? updates.email.trim().toLowerCase() : target.email.toLowerCase();
    const phone = updates.phone ? updates.phone.trim() : target.phone;

    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          ...updates,
          name: updates.name?.trim() || s.name,
          email: updates.email?.trim().toLowerCase() || s.email,
          phone: updates.phone?.trim() || s.phone,
          role: (s.email.toLowerCase() === SUPERADMIN_EMAIL) ? 'superadmin' : (updates.role || s.role),
        };
      }
      return s;
    }));

    // If password provided in edit, update it
    if (updates.password && updates.password.trim()) {
      const phoneDigits = normalizePhoneNumber(phone);
      setUserPasswords(prev => ({
        ...prev,
        [email]: updates.password!.trim(),
        ...(phoneDigits ? { [phoneDigits]: updates.password!.trim() } : {})
      }));
    }

    addAuditLog('staff_updated', `Updated details/role for staff member ID: ${staffId}`, staffId);
    return { success: true };
  };

  const deleteStaffMember = (staffId: string): { success: boolean; error?: string } => {
    const target = staffList.find(s => s.id === staffId);
    if (!target) return { success: false, error: 'Staff member not found.' };

    if (target.email.toLowerCase() === SUPERADMIN_EMAIL) {
      return { success: false, error: `Root superadmin (${SUPERADMIN_EMAIL}) cannot be deleted.` };
    }

    if (currentUser && currentUser.id === staffId) {
      return { success: false, error: 'You cannot delete your own logged-in account.' };
    }

    setStaffList(prev => prev.filter(s => s.id !== staffId));
    addAuditLog('staff_updated', `Superadmin deleted staff member: ${target.name} (${target.email})`, staffId);
    return { success: true };
  };

  const toggleStaffActive = (staffId: string) => {
    const target = staffList.find(s => s.id === staffId);
    if (target && target.email.toLowerCase() === SUPERADMIN_EMAIL) return;

    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextState = !s.isActive;
        return { ...s, isActive: nextState };
      }
      return s;
    }));
    addAuditLog('staff_updated', `Toggled active status for staff ID: ${staffId}`, staffId);
  };

  // Customer Management (Superadmin)
  const addCustomer = (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    preferredLocation?: string;
    budgetRange?: string;
    notes?: string;
    avatar?: string;
  }): { success: boolean; error?: string; customer?: CustomerUser } => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const password = data.password?.trim();

    if (!name) return { success: false, error: 'Customer full legal name is mandatory.' };
    if (!email || !email.includes('@')) return { success: false, error: 'A valid email address is mandatory.' };
    if (!phone) return { success: false, error: 'Mobile number is mandatory.' };
    if (!password || password.length < 6) return { success: false, error: 'Initial password is mandatory (minimum 6 characters).' };

    const exists = customerList.some(c => c.email.toLowerCase() === email);
    if (exists) {
      return { success: false, error: 'A customer with this email is already registered.' };
    }

    const newCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      role: 'client',
      preferredLocation: data.preferredLocation?.trim() || 'Karachi Prime Districts',
      budgetRange: data.budgetRange?.trim() || 'PKR 50M - 150M',
      notes: data.notes?.trim() || '',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      inquiriesCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const phoneDigits = normalizePhoneNumber(phone);
    setUserPasswords(prev => ({
      ...prev,
      [email]: password,
      ...(phoneDigits ? { [phoneDigits]: password } : {})
    }));

    setCustomerList(prev => [newCustomer, ...prev]);
    addAuditLog('system_settings', `Superadmin registered customer: ${newCustomer.name} (${newCustomer.email}, Phone: ${newCustomer.phone})`, newCustomer.id);
    return { success: true, customer: newCustomer };
  };

  const updateCustomer = (customerId: string, updates: Partial<CustomerUser> & { password?: string }): { success: boolean; error?: string } => {
    const target = customerList.find(c => c.id === customerId);
    if (!target) return { success: false, error: 'Customer not found.' };

    const email = updates.email ? updates.email.trim().toLowerCase() : target.email.toLowerCase();
    const phone = updates.phone ? updates.phone.trim() : target.phone;

    setCustomerList(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          ...updates,
          name: updates.name?.trim() || c.name,
          email: updates.email?.trim().toLowerCase() || c.email,
          phone: updates.phone?.trim() || c.phone,
        };
      }
      return c;
    }));

    if (updates.password && updates.password.trim()) {
      const phoneDigits = normalizePhoneNumber(phone);
      setUserPasswords(prev => ({
        ...prev,
        [email]: updates.password!.trim(),
        ...(phoneDigits ? { [phoneDigits]: updates.password!.trim() } : {})
      }));
    }

    addAuditLog('system_settings', `Updated profile for customer ID: ${customerId}`, customerId);
    return { success: true };
  };

  const deleteCustomer = (customerId: string): { success: boolean; error?: string } => {
    const target = customerList.find(c => c.id === customerId);
    if (!target) return { success: false, error: 'Customer not found.' };

    setCustomerList(prev => prev.filter(c => c.id !== customerId));
    addAuditLog('system_settings', `Superadmin removed customer account: ${target.name} (${target.email})`, customerId);
    return { success: true };
  };

  const toggleCustomerActive = (customerId: string) => {
    setCustomerList(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextStatus = c.status === 'active' ? 'inactive' : 'active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    addAuditLog('system_settings', `Toggled customer active status for ID: ${customerId}`, customerId);
  };

  // Attendance System Logic
  const todayAttendanceRecord = React.useMemo(() => {
    if (!currentUser) return undefined;
    const todayStr = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(r => 
      r.date === todayStr && 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [currentUser, attendanceRecords]);

  const clockIn = (notes?: string): { success: boolean; record?: AttendanceRecord; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to clock in.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const existing = attendanceRecords.find(r => 
      r.date === todayStr && 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (existing && existing.clockIn && !existing.clockOut) {
      return { success: false, error: 'You have already clocked in for today.' };
    }

    const now = new Date();
    // Flag late if clock-in is after 9:30 AM
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
    const initialStatus: AttendanceStatus = isLate ? 'late' : 'present';

    if (existing) {
      const updated: AttendanceRecord = {
        ...existing,
        clockIn: nowIso,
        clockOut: undefined,
        status: existing.status === 'on_leave' || existing.status === 'half_day' ? existing.status : initialStatus,
        notes: notes ? (existing.notes ? `${existing.notes} | ${notes}` : notes) : existing.notes,
        updatedAt: nowIso
      };
      setAttendanceRecords(prev => prev.map(r => r.id === existing.id ? updated : r));
      addAuditLog('attendance_updated', `${currentUser.name} (${currentUser.role}) clocked in for shift at ${now.toLocaleTimeString()}`, updated.id);
      return { success: true, record: updated };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email.toLowerCase(),
      userRole: currentUser.role,
      userAvatar: currentUser.avatar,
      userTitle: currentUser.title || (currentUser.role === 'superadmin' ? 'Managing Principal & Broker' : 'Real Estate Advisor'),
      date: todayStr,
      clockIn: nowIso,
      breaks: [],
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      netWorkMinutes: 0,
      status: initialStatus,
      notes: notes || '',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    addAuditLog('attendance_updated', `${currentUser.name} (${currentUser.role}) clocked in for today (${todayStr})`, newRecord.id);
    return { success: true, record: newRecord };
  };

  const clockOut = (notes?: string): { success: boolean; record?: AttendanceRecord; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to clock out.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const target = attendanceRecords.find(r => 
      r.date === todayStr && 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (!target || !target.clockIn) {
      return { success: false, error: 'No active clock-in found for today. Please clock in first.' };
    }

    if (target.clockOut) {
      return { success: false, error: 'You have already clocked out for today.' };
    }

    // Automatically close open break if currently on break
    let updatedBreaks = [...target.breaks];
    const openBreakIndex = updatedBreaks.findIndex(b => !b.endTime);
    if (openBreakIndex !== -1) {
      const openBreak = updatedBreaks[openBreakIndex];
      const startMs = new Date(openBreak.startTime).getTime();
      const endMs = new Date(nowIso).getTime();
      const dur = Math.max(1, Math.round((endMs - startMs) / 60000));
      updatedBreaks[openBreakIndex] = {
        ...openBreak,
        endTime: nowIso,
        durationMinutes: dur
      };
    }

    const startWorkMs = new Date(target.clockIn).getTime();
    const endWorkMs = new Date(nowIso).getTime();
    const totalWorkMinutes = Math.max(0, Math.round((endWorkMs - startWorkMs) / 60000));
    const totalBreakMinutes = updatedBreaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);
    const netWorkMinutes = Math.max(0, totalWorkMinutes - totalBreakMinutes);

    const updated: AttendanceRecord = {
      ...target,
      clockOut: nowIso,
      breaks: updatedBreaks,
      totalWorkMinutes,
      totalBreakMinutes,
      netWorkMinutes,
      notes: notes ? (target.notes ? `${target.notes} | Clock Out: ${notes}` : notes) : target.notes,
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => prev.map(r => r.id === target.id ? updated : r));
    addAuditLog('attendance_updated', `${currentUser.name} (${currentUser.role}) clocked out (${Math.floor(netWorkMinutes / 60)}h ${netWorkMinutes % 60}m productive time)`, target.id);
    return { success: true, record: updated };
  };

  const startBreak = (note?: string): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to start a break.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const target = attendanceRecords.find(r => 
      r.date === todayStr && 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (!target || !target.clockIn) {
      return { success: false, error: 'You must clock in before starting a break.' };
    }

    if (target.clockOut) {
      return { success: false, error: 'You cannot take a break after clocking out.' };
    }

    const hasOpenBreak = target.breaks.some(b => !b.endTime);
    if (hasOpenBreak) {
      return { success: false, error: 'You are already on an active break. Please end the current break first.' };
    }

    // MAXIMUM 2 BREAKS PER DAY RULE
    if (target.breaks.length >= 2) {
      return { success: false, error: 'Maximum limit reached: You are allowed a maximum of 2 breaks per day.' };
    }

    const breakNumber = (target.breaks.length + 1) as 1 | 2;
    const defaultLabel = breakNumber === 1 ? 'Meal / Lunch Break' : 'Tea / Coffee Break';

    const newBreak: AttendanceBreak = {
      id: `brk-${Date.now()}`,
      breakNumber,
      startTime: nowIso,
      note: note?.trim() || defaultLabel
    };

    const updated: AttendanceRecord = {
      ...target,
      breaks: [...target.breaks, newBreak],
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => prev.map(r => r.id === target.id ? updated : r));
    addAuditLog('attendance_updated', `${currentUser.name} started Break #${breakNumber} (${newBreak.note})`, target.id);
    return { success: true };
  };

  const endBreak = (): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to end a break.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const target = attendanceRecords.find(r => 
      r.date === todayStr && 
      (r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (!target) {
      return { success: false, error: 'Attendance record for today not found.' };
    }

    const openBreakIndex = target.breaks.findIndex(b => !b.endTime);
    if (openBreakIndex === -1) {
      return { success: false, error: 'No active break is currently in progress.' };
    }

    const openBreak = target.breaks[openBreakIndex];
    const startMs = new Date(openBreak.startTime).getTime();
    const endMs = new Date(nowIso).getTime();
    const durationMinutes = Math.max(1, Math.round((endMs - startMs) / 60000));

    const updatedBreaks = [...target.breaks];
    updatedBreaks[openBreakIndex] = {
      ...openBreak,
      endTime: nowIso,
      durationMinutes
    };

    const totalBreakMinutes = updatedBreaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);
    
    let totalWorkMinutes = target.totalWorkMinutes || 0;
    let netWorkMinutes = target.netWorkMinutes || 0;
    if (target.clockIn) {
      const workEndTime = target.clockOut ? new Date(target.clockOut).getTime() : Date.now();
      totalWorkMinutes = Math.max(0, Math.round((workEndTime - new Date(target.clockIn).getTime()) / 60000));
      netWorkMinutes = Math.max(0, totalWorkMinutes - totalBreakMinutes);
    }

    const updated: AttendanceRecord = {
      ...target,
      breaks: updatedBreaks,
      totalBreakMinutes,
      totalWorkMinutes,
      netWorkMinutes,
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => prev.map(r => r.id === target.id ? updated : r));
    addAuditLog('attendance_updated', `${currentUser.name} ended Break #${openBreak.breakNumber} (Duration: ${durationMinutes} mins)`, target.id);
    return { success: true };
  };

  const updateAttendanceRecord = (recordId: string, updates: Partial<AttendanceRecord>, reason?: string): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Authentication required.' };
    }

    const target = attendanceRecords.find(r => r.id === recordId);
    if (!target) {
      return { success: false, error: 'Attendance record not found.' };
    }

    const isSuperadmin = currentUser.role === 'superadmin' || currentUser.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
    const isAdmin = currentUser.role === 'admin';

    if (!isSuperadmin && !isAdmin) {
      return { success: false, error: 'Permission denied: Only Admins and Superadmins can modify attendance records.' };
    }

    // STRICT BUSINESS RULE:
    // Admins can add and edit employees' attendance but CANNOT edit their own attendance.
    // Super admin has complete access.
    if (isAdmin && !isSuperadmin) {
      const isOwnRecord = target.userId === currentUser.id || target.userEmail.toLowerCase() === currentUser.email.toLowerCase();
      if (isOwnRecord) {
        return { 
          success: false, 
          error: 'Security Policy: Admins cannot edit their own attendance records. Please contact the Superadmin for adjustments.' 
        };
      }
    }

    // Maximum 2 breaks validation
    if (updates.breaks && updates.breaks.length > 2) {
      return { success: false, error: 'Strict Constraint: A maximum of 2 breaks are permitted per attendance record.' };
    }

    let breaksToSave = updates.breaks !== undefined ? updates.breaks : target.breaks;
    breaksToSave = breaksToSave.map(b => {
      if (b.startTime && b.endTime && (!b.durationMinutes || b.durationMinutes <= 0)) {
        const dur = Math.max(1, Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000));
        return { ...b, durationMinutes: dur };
      }
      return b;
    });

    const clockInVal = updates.clockIn !== undefined ? updates.clockIn : target.clockIn;
    const clockOutVal = updates.clockOut !== undefined ? updates.clockOut : target.clockOut;

    const totalBreakMinutes = breaksToSave.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);
    let totalWorkMinutes = updates.totalWorkMinutes !== undefined ? updates.totalWorkMinutes : target.totalWorkMinutes;
    
    if (clockInVal && clockOutVal) {
      const inMs = new Date(clockInVal).getTime();
      const outMs = new Date(clockOutVal).getTime();
      if (!isNaN(inMs) && !isNaN(outMs)) {
        totalWorkMinutes = Math.max(0, Math.round((outMs - inMs) / 60000));
      }
    }

    const netWorkMinutes = Math.max(0, totalWorkMinutes - totalBreakMinutes);

    const nowIso = new Date().toISOString();
    const updated: AttendanceRecord = {
      ...target,
      ...updates,
      breaks: breaksToSave,
      totalBreakMinutes,
      totalWorkMinutes,
      netWorkMinutes,
      editedBy: {
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        timestamp: nowIso,
        reason: reason || 'Administrative adjustment'
      },
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => prev.map(r => r.id === recordId ? updated : r));
    addAuditLog('attendance_updated', `${currentUser.name} (${currentUser.role}) updated attendance record for ${target.userName} on ${target.date}. Reason: ${reason || 'Admin modification'}`, recordId);
    return { success: true };
  };

  const addAttendanceRecord = (recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): { success: boolean; record?: AttendanceRecord; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Authentication required.' };
    }

    const isSuperadmin = currentUser.role === 'superadmin' || currentUser.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
    const isAdmin = currentUser.role === 'admin';

    if (!isSuperadmin && !isAdmin) {
      return { success: false, error: 'Permission denied: Only Admins and Superadmins can manually add attendance records.' };
    }

    if (isAdmin && !isSuperadmin) {
      const isOwn = recordData.userId === currentUser.id || recordData.userEmail.toLowerCase() === currentUser.email.toLowerCase();
      if (isOwn) {
        return { success: false, error: 'Admins cannot manually insert attendance records for themselves. Please use standard Clock In/Out or contact Superadmin.' };
      }
    }

    if (recordData.breaks && recordData.breaks.length > 2) {
      return { success: false, error: 'A maximum of 2 breaks are permitted per shift.' };
    }

    const nowIso = new Date().toISOString();
    const breaksToSave = (recordData.breaks || []).map((b, idx) => {
      const bNum = (idx + 1) as 1 | 2;
      let dur = b.durationMinutes;
      if (b.startTime && b.endTime && (!dur || dur <= 0)) {
        dur = Math.max(1, Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000));
      }
      return { ...b, breakNumber: bNum, durationMinutes: dur };
    });

    const totalBreakMinutes = breaksToSave.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);
    let totalWorkMinutes = recordData.totalWorkMinutes || 0;
    if (recordData.clockIn && recordData.clockOut) {
      const inMs = new Date(recordData.clockIn).getTime();
      const outMs = new Date(recordData.clockOut).getTime();
      if (!isNaN(inMs) && !isNaN(outMs)) {
        totalWorkMinutes = Math.max(0, Math.round((outMs - inMs) / 60000));
      }
    }
    const netWorkMinutes = Math.max(0, totalWorkMinutes - totalBreakMinutes);

    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-manual-${Date.now()}`,
      breaks: breaksToSave,
      totalBreakMinutes,
      totalWorkMinutes,
      netWorkMinutes,
      editedBy: {
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        timestamp: nowIso,
        reason: 'Manual entry by ' + currentUser.name
      },
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    addAuditLog('attendance_created', `${currentUser.name} manually recorded attendance for ${recordData.userName} on ${recordData.date}`, newRecord.id);
    return { success: true, record: newRecord };
  };

  const deleteAttendanceRecord = (recordId: string): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Authentication required.' };
    }

    const isSuperadmin = currentUser.role === 'superadmin' || currentUser.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
    if (!isSuperadmin) {
      return { success: false, error: 'Permission denied: Only the Superadmin can delete attendance records.' };
    }

    const target = attendanceRecords.find(r => r.id === recordId);
    if (!target) {
      return { success: false, error: 'Attendance record not found.' };
    }

    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    addAuditLog('attendance_deleted', `Superadmin deleted attendance record of ${target.userName} for date ${target.date}`, recordId);
    return { success: true };
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
        changePassword,
        forgotPasswordReset,
        updateUserProfile,
        sendEmailAuthorizationCode,
        verifyEmailAuthorizationCode,
        isAccountSettingsOpen,
        accountSettingsInitialTab,
        openAccountSettings,
        closeAccountSettings,
        currentInterface,
        setInterface,
        currentUserRole,
        currentStaffUser,
        staffList,
        customerList,
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
        deleteStaffMember,
        toggleStaffActive,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerActive,
        attendanceRecords,
        todayAttendanceRecord,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        auditLogs,
        addAuditLog,
        selectedPropertyForDetail,
        setSelectedPropertyForDetail,
        activeStaffTab,
        setActiveStaffTab,
        websiteContent,
        updateWebsiteContent,
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
