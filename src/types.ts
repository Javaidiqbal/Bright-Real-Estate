export type UserRole = 'superadmin' | 'admin' | 'client' | 'public';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'client';
  avatar?: string;
  phone?: string;
  title?: string;
  createdAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  title: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  commissionRate: number; // e.g. 2.5%
  activeListingsCount: number;
  totalDealsClosed: number;
  salesVolume: number; // e.g. $14,500,000
  isActive: boolean;
  joinedDate: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client';
  avatar?: string;
  preferredLocation?: string;
  budgetRange?: string;
  inquiriesCount?: number;
  status: 'active' | 'inactive';
  joinedDate: string;
  notes?: string;
}

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'draft' | 'under_review';
export type ListingType = 'for_sale' | 'for_rent';
export type PropertyCategory = 'single_family' | 'luxury_villa' | 'penthouse' | 'condo' | 'townhouse' | 'modern_estate';

export interface Property {
  id: string;
  title: string;
  tagline: string;
  description: string;
  listingType: ListingType;
  category: PropertyCategory;
  price: number;
  rentalPeriod?: 'monthly' | 'weekly' | 'yearly';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSizeSqft?: number;
  yearBuilt: number;
  garageSpaces: number;
  hoaFeeMonthly: number;
  propertyTaxAnnual: number;
  status: PropertyStatus;
  featured: boolean;
  images: string[];
  amenities: string[];
  assignedAgentId: string;
  mlsNumber: string;
  virtualTourUrl?: string;
  viewsCount: number;
  favoritesCount: number;
  inquiriesCount: number;
  dateListed: string;
  lastUpdated: string;
  approvedBySuperadmin?: boolean;
}

export type LeadStatus = 'new' | 'contacted' | 'tour_scheduled' | 'offer_submitted' | 'closed' | 'archived';
export type LeadType = 'inquiry' | 'tour_booking' | 'valuation_request' | 'general_contact';

export interface LeadInquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  leadType: LeadType;
  status: LeadStatus;
  message: string;
  tourDate?: string;
  tourTime?: string;
  tourType?: 'in_person' | 'virtual_video';
  assignedAgentId: string;
  assignedAgentName?: string;
  budgetRange?: string;
  preApprovedMortgage?: boolean;
  internalNotes: string[];
  createdAt: string;
  lastContactedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'superadmin' | 'admin';
  actionType: 'property_created' | 'property_updated' | 'property_deleted' | 'status_changed' | 'staff_updated' | 'lead_updated' | 'system_settings' | 'attendance_updated' | 'attendance_created' | 'attendance_deleted';
  description: string;
  targetId?: string;
}

export interface AttendanceBreak {
  id: string;
  breakNumber: 1 | 2;
  startTime: string; // ISO string
  endTime?: string;  // ISO string
  durationMinutes?: number;
  note?: string;
}

export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent' | 'on_leave';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'superadmin' | 'admin' | 'client';
  userAvatar?: string;
  userTitle?: string;
  date: string; // 'YYYY-MM-DD'
  clockIn?: string; // ISO string
  clockOut?: string; // ISO string
  breaks: AttendanceBreak[]; // Maximum 2 breaks allowed
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  netWorkMinutes: number;
  status: AttendanceStatus;
  notes?: string;
  editedBy?: {
    userId: string;
    userName: string;
    userRole: string;
    timestamp: string;
    reason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  listingType: 'all' | 'for_sale' | 'for_rent';
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string; // 'all', '1', '2', '3', '4+'
  bathrooms: string; // 'all', '1', '2', '3+'
  minSqft: number;
  amenities: string[];
  city: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'sqft_desc';
}

export interface MortgageCalculatorParams {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  hoaFeeMonthly: number;
}

export interface WebsiteContent {
  heroTagline: string;
  heroHeading: string;
  heroSubheading: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutMission: string;
  contactOfficeAddress: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  contactHours: string;
  contactMapLocationName: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  footerText: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialTiktok: string;
}

