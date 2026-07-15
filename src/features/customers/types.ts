export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
}

export interface Customer {
  _id?: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: Address;
  designation?: string; 
  source?: string; 
  notes?: string;
  createdBy?: string;
}