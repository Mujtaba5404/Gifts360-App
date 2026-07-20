import { Item } from '../../api/useItems';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface OrderItemRow {
  item?: Item;
  quantity: string;
  /** Purchase order mein unit cost, sales order mein unit price — value ek hi field mein rehti hai. */
  unitCost: string;
}

/**
 * Sirf sales order ko orderStatus / paymentMode / occasion / salesPerson jaise
 * extra dropdowns chahiye. Inhe generic rakha hai taake purchase order ka
 * layout bilkul waisa hi rahe.
 */
export interface OrderFormExtraSelect {
  key: string;
  label: string;
  placeholder: string;
  options: DropdownOption[];
  isLoading?: boolean;
  required?: boolean;
}

/** Form ki poori state — submit par screen ko isi shape mein values milti hain. */
export interface OrderFormValues {
  partyId: string;
  rows: OrderItemRow[];
  discountAmount: string;
  taxAmount: string;
  serviceOrDeliveryFee: string;
  orderDate: Date;
  invoiceSubmissionDate?: Date;
  paymentStatus: string;
  paymentDate?: Date;
  isReceived: boolean;
  receivedOn?: Date;
  notes: string;
  /** extraSelects ki chuni hui values, key ke against. */
  extras: Record<string, string>;
}

export interface OrderFormProps {
  headerText: string;
  submitText: string;
  submittingText: string;

  /** Vendor (purchase order) ya Customer (sales order). */
  partyLabel: string;
  partyPlaceholder: string;
  partyOptions: DropdownOption[];
  isLoadingParty: boolean;

  /** 'Unit Cost' (PO) ya 'Unit Price' (SO). */
  unitLabel?: string;

  /** Ye do fields sirf purchase order par hain. */
  showInvoiceSubmissionDate?: boolean;
  showReceived?: boolean;

  /** Payment status ke baad render hone wale extra dropdowns (sales order). */
  extraSelects?: OrderFormExtraSelect[];

  /** Edit mode mein record load hone ke baad pre-fill ke liye. */
  initialValues?: Partial<OrderFormValues>;
  isLoadingInitial?: boolean;
  hasLoadError?: boolean;
  loadErrorText?: string;

  isPending: boolean;
  onSubmit: (values: OrderFormValues) => Promise<void> | void;
}

export const PAYMENT_STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
];

export const emptyRow = (): OrderItemRow => ({
  item: undefined,
  quantity: '1',
  unitCost: '0',
});
