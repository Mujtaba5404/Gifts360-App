/**
 * Backend `paymentMode` ko in exact lowercase values mein hi accept karta hai,
 * is liye UI par label dikhate hain aur API ko `value` bhejte hain.
 */
export interface PaymentModeOption {
  label: string;
  value: string;
}

export const PAYMENT_MODES: PaymentModeOption[] = [
  { label: 'Cash', value: 'cash' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'Credit Card', value: 'credit card' },
];

export const CASH_PAYMENT_MODE = 'cash';

export const getPaymentModeLabel = (value?: string) =>
  PAYMENT_MODES.find(mode => mode.value === value)?.label ?? value ?? '-';
