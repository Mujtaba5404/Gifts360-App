import { Item } from '../../api/useItems';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface OrderItemRow {
  item?: Item;
  quantity: string;
  unitCost: string;
}

export interface OrderFormExtraSelect {
  key: string;
  label: string;
  placeholder: string;
  options: DropdownOption[];
  isLoading?: boolean;
  required?: boolean;
}


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
  extras: Record<string, string>;
}

export interface OrderFormProps {
  headerText: string;
  submitText: string;
  submittingText: string;
  partyLabel: string;
  partyPlaceholder: string;
  partyOptions: DropdownOption[];
  isLoadingParty: boolean;
  unitLabel?: string;
  showInvoiceSubmissionDate?: boolean;
  showReceived?: boolean;
  extraSelects?: OrderFormExtraSelect[];
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
