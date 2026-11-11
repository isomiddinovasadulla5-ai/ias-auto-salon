export type Language = 'uz' | 'ru';
export type Theme = 'dark' | 'light';

export type VehicleStatus = 'available' | 'sold' | 'reserved';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type TransmissionType = 'automatic' | 'manual' | 'robot';
export type BodyType = 'sedan' | 'suv' | 'coupe' | 'crossover' | 'hatchback' | 'minivan';
export type DriveType = 'AWD' | 'RWD' | 'FWD';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number; // in USD
  mileage: number; // in km
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  color: string;
  interiorColor?: string;
  engine?: string;
  power?: number; // Horsepower (HP)
  driveType?: DriveType;
  acceleration?: string; // e.g. "3.8 s"
  topSpeed?: string; // e.g. "250 km/h"
  descriptionUz: string;
  descriptionRu: string;
  features: string[];
  images: string[];
  status: VehicleStatus;
  isPublished: boolean;
  isFeatured: boolean;
  createdByAdminId: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  vehicleId: string;
  vehicleTitle: string;
  preferredDate: string;
  preferredTime: string;
  comments?: string;
  status: BookingStatus;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'resolved';

export interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';
export type AdminAccountStatus = 'active' | 'suspended';

export interface AdminAccount {
  id: string; // Document ID / auth UID
  adminId: string; // e.g. IAS-ADMIN-001
  name: string;
  email: string;
  role: AdminRole;
  status: AdminAccountStatus;
  requirePasswordChange: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  entityType?: 'vehicle' | 'admin' | 'booking' | 'settings' | 'auth';
  entityId?: string;
  timestamp: string;
}

export interface SalonSettings {
  salonName: string;
  taglineUz: string;
  taglineRu: string;
  telegramLink: string;
  instagramLink: string;
  phonePrimary: string;
  phoneSecondary: string;
  addressUz: string;
  addressRu: string;
  workingHours: string;
  usdToUzsRate: number; // Exchange rate, e.g. 12850
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  brand: string;
  model: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  status: string; // 'all' | 'available' | 'sold'
  sortBy: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'featured';
}

export interface AuthSession {
  token: string;
  adminId: string;
  name: string;
  email: string;
  role: AdminRole;
  requirePasswordChange?: boolean;
}
