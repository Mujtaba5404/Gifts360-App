import { useApiMutation, useApiQuery } from '../services';

export interface PurchaseOrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
}

export interface PurchaseOrderVendor {
  _id: string;
  title: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  address?: PurchaseOrderAddress;
  compiledAddress?: string;
}

export interface PurchaseOrderLineItemProduct {
  _id: string;
  title: string;
  sku?: string;
  category?: string;
  unit?: string;
  sellingPrice?: number;
  costPrice?: number;
  stockInHand?: number;
}

export interface PurchaseOrderLineItem {
  item?: PurchaseOrderLineItemProduct;
  sku?: string;
  title: string;
  quantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrderCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export type PurchaseOrderPaymentStatus =
  | 'pending'
  | 'paid'
  | 'partial'
  | 'overdue';

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  vendor: PurchaseOrderVendor;
  items: PurchaseOrderLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceOrDeliveryFee: number;
  grandTotal: number;
  orderDate: string;
  invoiceSubmissionDate?: string;
  paymentStatus: PurchaseOrderPaymentStatus;
  paymentDate?: string;
  isReceived: boolean;
  receivedOn?: string;
  createdBy?: PurchaseOrderCreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrdersMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetPurchaseOrdersResponse {
  data: PurchaseOrder[];
  meta: PurchaseOrdersMeta;
}

export interface GetPurchaseOrdersParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /purchaseOrders (list) ----------

export const usePurchaseOrders = (params?: GetPurchaseOrdersParams) => {
  return useApiQuery<GetPurchaseOrdersResponse>(
    ['purchaseOrders', params],
    {
      method: 'GET',
      endPoint: '/purchaseOrders',
      requestConfig: { params },
    },
  );
};

// ---------- GET /purchaseOrders/:id (single) ----------

export type GetPurchaseOrderResponse = PurchaseOrder;

export const usePurchaseOrder = (id?: string) => {
  return useApiQuery<GetPurchaseOrderResponse>(
    ['purchaseOrder', id],
    {
      method: 'GET',
      endPoint: `purchaseOrders/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /purchaseOrders (create) ----------

export interface CreatePurchaseOrderLineItemPayload {
  item?: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseOrderPayload {
  vendor: string;
  items: CreatePurchaseOrderLineItemPayload[];
  discountAmount?: number;
  taxAmount?: number;
  serviceOrDeliveryFee?: number;
  orderDate: string;
  invoiceSubmissionDate?: string;
  paymentStatus?: PurchaseOrderPaymentStatus;
  paymentDate?: string;
  isReceived?: boolean;
  receivedOn?: string;
  notes?: string;
}

export interface CreatePurchaseOrderResponse {
  data: PurchaseOrder;
  message?: string;
}

export interface CreatePurchaseOrderVariables {
  body: CreatePurchaseOrderPayload;
}

export const useCreatePurchaseOrder = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation <CreatePurchaseOrderResponse, CreatePurchaseOrderPayload >
  ({
    method: 'POST',
    endPoint: '/purchaseOrders',
  });

  const createPurchaseOrder = (body: CreatePurchaseOrderPayload) =>
    mutateAsync({ body });

  return { createPurchaseOrder, isPending, isError, error };
};

// ---------- PUT /purchaseOrders/:id (update) ----------

export interface UpdatePurchaseOrderPayload extends CreatePurchaseOrderPayload {
  id: string;
}

export interface UpdatePurchaseOrderResponse {
  data: PurchaseOrder;
  message?: string;
}

export interface UpdatePurchaseOrderVariables {
  id: string;
  body: CreatePurchaseOrderPayload;
}

export const useUpdatePurchaseOrder = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    UpdatePurchaseOrderResponse,
    UpdatePurchaseOrderVariables
  >({
    method: 'PATCH',
    endPoint: '/purchaseOrders',
  });

  const updatePurchaseOrder = ({ id, ...body }: UpdatePurchaseOrderPayload) =>
    mutateAsync({ id, body });

  return { updatePurchaseOrder, isPending, isError, error };
};