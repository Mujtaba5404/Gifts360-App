import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '../services';

export interface PettyCashUser {
  _id: string;
  name: string;
  email: string;
}

export interface PettyCashAccount {
  _id: string;
  title: string;
  value: string;
  color?: string;
  scope?: string;
  resource?: string;
  field?: string;
  parentPicklist?: string | null;
}

export interface PettyCash {
  _id: string;
  date: string;
  user: PettyCashUser;
  description: string;
  account: PettyCashAccount;
  amount: number;
  balance: number;
}

export interface PettyCashMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetPettyCashResponse {
  data: PettyCash[];
  meta: PettyCashMeta;
}

export interface GetPettyCashParams {
  page?: number;
  pageSize?: number;
  sort?: string
}

// ---------- GET /pettyCash (list) ----------

export const usePettyCash = (params?: GetPettyCashParams) => {
  return useApiQuery<GetPettyCashResponse>(
    ['petty-cash', params],
    {
      method: 'GET',
      endPoint: '/pettyCash',
      requestConfig: { params },
    },
  );
};

// ---------- POST /pettyCash (create) ----------

export interface CreatePettyCashRequestBody {
  date: string; 
  description: string;
  account: string;
  amount: number;
  user?: string;
}

export interface CreatePettyCashResponse {
  success: boolean;
  message: string;
  data: PettyCash;
}

interface CreatePettyCashMutationPayload {
  body: CreatePettyCashRequestBody;
}

export const useCreatePettyCash = () => {
  const mutation = useApiMutation<CreatePettyCashResponse, CreatePettyCashRequestBody>({
    method: 'POST',
    endPoint: 'pettyCash',
  });

  const createPettyCash = useCallback(
    ({ body }: CreatePettyCashMutationPayload) => mutation.mutateAsync({ body }),
    [mutation],
  );

  return { ...mutation, createPettyCash };
};

// ---------- PATCH /pettyCash/:id (update) ----------
 
export type UpdatePettyCashRequestBody = Partial<CreatePettyCashRequestBody>;
 
export interface UpdatePettyCashResponse {
  success: boolean;
  message: string;
  data: PettyCash;
}
 
interface UpdatePettyCashMutationPayload {
  id: string;
  body: UpdatePettyCashRequestBody;
}
 
export const useUpdatePettyCash = () => {
  const mutation = useApiMutation<UpdatePettyCashResponse, UpdatePettyCashRequestBody>({
    method: 'PATCH',
    endPoint: '/pettyCash',
  });
 
  const updatePettyCash = useCallback(
    ({ id, body }: UpdatePettyCashMutationPayload) =>
      mutation.mutateAsync({ endPoint: `pettyCash/${id}`, body }),
    [mutation],
  );
 
  return { ...mutation, updatePettyCash };
};