import { PaymentStatus } from './common.model';

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  vendor_contact_number: string;
  vendor_email?: string;
}

export interface VendorAddress {
  vendor_id: string;
  vendor_city: string;
  vendor_baranggay: string;
  vendor_street?: string;
  vendor_province: string;
  vendor_zip_code: string;
}

export interface VendorStorage {
  vendor_id: string;
  vendor_storage_size: number;
  vendor_storage_limit: number;
}

export interface VendorMembership {
  vendor_id: string;
  active: boolean;
  renewal_date: string;
  activation_date: string;
  payment_status: PaymentStatus;
  type: VendorMembershipType;
}

export type VendorMembershipType = 'BASIC' | 'PRO';
