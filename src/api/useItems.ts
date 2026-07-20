import { useApiQuery } from '../services';

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