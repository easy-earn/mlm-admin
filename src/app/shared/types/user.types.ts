export interface User {
  access_token?: string;
  userDoc: UserObject
}

export interface Doc {
  created_at?: string;
  updated_at?: string;
}

export interface UserObject extends Doc {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  referral_code: string;
  status: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string | number;
  zipcode?: number;
  is_terms_accepted: boolean;
  is_verified: boolean;
  transaction_id?: string;
  transaction?: Transaction;
  plan?: Plan;
  account_balance?: number;
}

export interface Plan extends Doc {
  plan_id?: string;
  plan_name: string;
  amount: number;
}
export interface Transaction extends Doc {
  user_id: string;
  upi: string;
  utr: string;
  plan_id: string;
  transaction_type: number
  is_verified: boolean
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  package?: any;
  parent_code?: string;
  is_terms_accepted: boolean;
}

export interface UpdatePasswordForm {
  email: string;
  otp: string | number;
  password: string;
}
