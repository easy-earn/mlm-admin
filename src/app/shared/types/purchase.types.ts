
export interface PlanDialogData {
  plan: {
    plan_id: number,
    plan_name: string,
    amount: number,
    qr: string
  }
}

export interface PurchaseForm {
  upi: string;
  utr: string;
  bank_account_number?: number | null;
  ifsc_code?: string | null;
  plan_id: number | null;
  plan_amount: number | null;
}
