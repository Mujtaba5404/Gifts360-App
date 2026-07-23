import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from '../services';

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
}

export interface Customer {
  _id: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: Address;
  designation?: string;
  source?: string;
  notes?: string;
  createdBy?: string;
}

export interface CustomersMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetCustomersResponse {
  data: Customer[];
  meta: CustomersMeta;
}

export interface GetCustomersParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /customers (list) ----------

export const useCustomers = (params?: GetCustomersParams,) => {
  return useApiQuery<GetCustomersResponse>(
    ['customers', params],
    {
      method: 'GET',
      endPoint: '/customers',
      requestConfig: { params },
    },
  );
};

// ---------- GET /customers/:id (single) ----------

export const useCustomer = (id: string) => {
  return useApiQuery<{ success: boolean; data: Customer }>(
    ['customers', id],
    {
      method: 'GET',
      endPoint: `customers/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /customers (create) ----------

export interface CreateCustomerRequestBody {
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: Address;
  designation?: string;
  source?: string;
  notes?: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

interface CreateCustomerMutationPayload {
  body: CreateCustomerRequestBody;
}

export const useCreateCustomer = () => {
  const mutation = useApiMutation<CreateCustomerResponse, CreateCustomerRequestBody>({
    method: 'POST',
    endPoint: 'customers',
  });
  const createCustomer = useCallback(
    ({ body }: CreateCustomerMutationPayload) => mutation.mutateAsync({ body }),
    [mutation],
  );
  return { ...mutation, createCustomer };
};

// ---------- PATCH /customers/:id (update) ----------

export type UpdateCustomerRequestBody = Partial<CreateCustomerRequestBody>;

export interface UpdateCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

interface UpdateCustomerMutationPayload {
  id: string;
  body: UpdateCustomerRequestBody;
}

export const useUpdateCustomer = () => {
  const mutation = useApiMutation<UpdateCustomerResponse, UpdateCustomerRequestBody>({
    method: 'PATCH',
    endPoint: 'customers',
  });
  const updateCustomer = useCallback(
    ({ id, body }: UpdateCustomerMutationPayload) =>
      mutation.mutateAsync({ endPoint: `customers/${id}`, body }),
    [mutation],
  );
  return { ...mutation, updateCustomer };
};

// ---------- DELETE /customers/:id (delete) ----------

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}

interface DeleteCustomerMutationPayload {
  id: string;
}

export const useDeleteCustomer = () => {
  const mutation = useApiMutation<DeleteCustomerResponse>({
    method: 'DELETE',
    endPoint: '/customers',
  });

  const deleteCustomer = useCallback(
    ({ id }: DeleteCustomerMutationPayload) =>
      mutation.mutateAsync({ endPoint: `customers/${id}` }),
    [mutation],
  );

  return { ...mutation, deleteCustomer };
};