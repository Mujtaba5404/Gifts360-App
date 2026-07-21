import { useApiMutation, useApiQuery } from '../services';

export interface SalesOrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
}

export interface SalesOrderCustomer {
  _id: string;
  title: string;
  email?: string;
  phone?: string;
  company?: string;
  designation?: string;
  source?: string;
  address?: SalesOrderAddress;
  compiledAddress?: string;
}

export interface SalesOrderLineItemProduct {
  _id: string;
  title: string;
  sku?: string;
  category?: string;
  unit?: string;
  sellingPrice?: number;
  costPrice?: number;
  stockInHand?: number;
}

export interface SalesOrderLineItem {
  item?: SalesOrderLineItemProduct;
  sku?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  unitCost?: number;
  lineCost?: number;
}

export interface SalesOrderPerson {
  _id: string;
  name: string;
  email: string;
}

export interface SalesOrderPicklistValue {
  _id: string;
  title: string;
  value: string;
  color?: string;
}

export type SalesOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type SalesOrderPaymentStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'partial'
  | 'overdue';

export interface SalesOrder {
  _id: string;
  orderId: string;
  customer: SalesOrderCustomer;
  items: SalesOrderLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceOrDeliveryFee: number;
  grandTotal: number;
  orderDate: string;
  orderStatus: SalesOrderStatus;
  paymentStatus: SalesOrderPaymentStatus;
  paymentDate?: string;
  paymentMode?: SalesOrderPicklistValue;
  occasion?: SalesOrderPicklistValue;
  salesPerson?: SalesOrderPerson;
  createdBy?: SalesOrderPerson;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrdersMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetSalesOrdersResponse {
  data: SalesOrder[];
  meta: SalesOrdersMeta;
}

export interface GetSalesOrdersParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /salesOrders (list) ----------

export const useSalesOrders = (params?: GetSalesOrdersParams) => {
  return useApiQuery<GetSalesOrdersResponse>(
    ['salesOrders', params],
    {
      method: 'GET',
      endPoint: 'salesOrders',
      requestConfig: { params },
    },
  );
};

// ---------- GET /salesOrders/:id (single) ----------

export const useSalesOrder = (id?: string) => {
  return useApiQuery<{ data: SalesOrder }>(
    ['salesOrder', id],
    {
      method: 'GET',
      endPoint: `salesOrders/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /salesOrders (create) ----------

export interface CreateSalesOrderLineItemPayload {
  item?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalesOrderPayload {
  customer: string;
  items: CreateSalesOrderLineItemPayload[];
  discountAmount?: number;
  taxAmount?: number;
  serviceOrDeliveryFee?: number;
  orderDate: string;
  orderStatus?: SalesOrderStatus;
  paymentStatus?: SalesOrderPaymentStatus;
  paymentMode?: string;
  paymentDate?: string;
  occasion?: string;
  salesPerson?: string;
  notes?: string;
}

export interface CreateSalesOrderResponse {
  data: SalesOrder;
  message?: string;
}

export const useCreateSalesOrder = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    CreateSalesOrderResponse,
    CreateSalesOrderPayload
  >({
    method: 'POST',
    endPoint: 'salesOrders',
  });

  const createSalesOrder = (body: CreateSalesOrderPayload) =>
    mutateAsync({ body });

  return { createSalesOrder, isPending, isError, error };
};

// ---------- PATCH /salesOrders/:id (update) ----------

export interface UpdateSalesOrderPayload extends CreateSalesOrderPayload {
  id: string;
}

export interface UpdateSalesOrderResponse {
  data: SalesOrder;
  message?: string;
}

export const useUpdateSalesOrder = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    UpdateSalesOrderResponse,
    CreateSalesOrderPayload
  >({
    method: 'PATCH',
    endPoint: 'salesOrders',
  });

  const updateSalesOrder = ({ id, ...body }: UpdateSalesOrderPayload) =>
    mutateAsync({ endPoint: `salesOrders/${id}`, body });

  return { updateSalesOrder, isPending, isError, error };
};

// ---------- DELETE /salesOrders/:id ----------

export interface DeleteSalesOrderResponse {
  success: boolean;
  message: string;
}

export const useDeleteSalesOrder = () => {
  const { mutateAsync, isPending, isError, error } =
    useApiMutation<DeleteSalesOrderResponse>({
      method: 'DELETE',
      endPoint: 'salesOrders',
    });

  const deleteSalesOrder = ({ id }: { id: string }) =>
    mutateAsync({ endPoint: `salesOrders/${id}` });

  return { deleteSalesOrder, isPending, isError, error };
};