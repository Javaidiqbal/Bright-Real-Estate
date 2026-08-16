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
  actionType: 'property_created' | 'property_updated' | 'property_deleted' | 'status_changed' | 'staff_updated' | 'lead_updated' | 'system_settings';
  description: string;
  targetId?: string;
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
