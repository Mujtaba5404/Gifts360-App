import { useApiMutation, useApiQuery } from '../services';

export interface ItemPicklistValue {
  _id: string;
  title: string;
  value: string;
  color?: string;
}

export interface ItemCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Item {
  _id: string;
  title: string;
  sku?: string;
  category?: ItemPicklistValue;
  unit?: ItemPicklistValue;
  description?: string;
  sellingPrice?: number;
  costPrice?: number;
  reorderLevel?: number;
  isPerishable?: boolean;
  stockInHand?: number;
  costOfStockInHand?: number;
  averageUnitCost?: number;
  createdBy?: ItemCreatedBy;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemsMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetItemsResponse {
  data: Item[];
  meta: ItemsMeta;
}

export interface GetItemsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /items (list) ----------

export const useItems = (params?: GetItemsParams) => {
  return useApiQuery<GetItemsResponse>(
    ['items', params],
    {
      method: 'GET',
      endPoint: 'items',
      requestConfig: { params },
    },
  );
};

// ---------- GET /items/:id (single) ----------

export type GetItemResponse = Item;

export const useItem = (id?: string) => {
  return useApiQuery<GetItemResponse>(
    ['item', id],
    {
      method: 'GET',
      endPoint: `items/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /items (create) ----------

export interface CreateItemPayload {
  title: string;
  category?: string;
  unit?: string;
  description?: string;
  sellingPrice?: number;
  costPrice?: number;
  reorderLevel?: number;
  isPerishable?: boolean;
}

export interface CreateItemResponse {
  data: Item;
  message?: string;
}

export const useCreateItem = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    CreateItemResponse,
    CreateItemPayload
  >({
    method: 'POST',
    endPoint: 'items',
  });

  const createItem = (body: CreateItemPayload) => mutateAsync({ body });

  return { createItem, isPending, isError, error };
};

// ---------- PATCH /items/:id (update) ----------

export interface UpdateItemPayload extends Partial<CreateItemPayload> {
  id: string;
}

export interface UpdateItemResponse {
  data: Item;
  message?: string;
}

export const useUpdateItem = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    UpdateItemResponse,
    Partial<CreateItemPayload>
  >({
    method: 'PATCH',
    endPoint: 'items',
  });

  const updateItem = ({ id, ...body }: UpdateItemPayload) =>
    mutateAsync({ endPoint: `items/${id}`, body });

  return { updateItem, isPending, isError, error };
};

// ---------- DELETE /items/:id ----------

export interface DeleteItemResponse {
  success: boolean;
  message: string;
}

export const useDeleteItem = () => {
  const { mutateAsync, isPending, isError, error } =
    useApiMutation<DeleteItemResponse>({
      method: 'DELETE',
      endPoint: 'items',
    });

  const deleteItem = ({ id }: { id: string }) =>
    mutateAsync({ endPoint: `items/${id}` });

  return { deleteItem, isPending, isError, error };
};