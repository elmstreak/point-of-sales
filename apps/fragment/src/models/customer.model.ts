export interface Customer {
  customer_id: string; // SHA-64 result from phone number
  customer_contact_number: string;
  customer_address_city: string;
  customer_address_baranggay: string;
  customer_address_street?: string;
  customer_address_province: string;
  customer_address_zip_code: string;
  verified: boolean;
}

export interface CustomerOrders {
  customer_id: string;
  order_id: string;
  date_created: string;
}
