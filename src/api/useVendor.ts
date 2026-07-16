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

// ---------- GET /vendors (list) ----------

export const useVendors = (params?: GetCustomersParams) => {
    return useApiQuery<GetCustomersResponse>(
        ['vendor', params],
        {
            method: 'GET',
            endPoint: '/vendor',
            requestConfig: { params },
        },
    );
};

// ---------- GET /vendor/:id (single) ----------

export const useVendor = (id: string) => {
    return useApiQuery<{ success: boolean; data: Customer }>(
        ['vendor', id],
        {
            method: 'GET',
            endPoint: `vendor/${id}`,
        },
        { enabled: !!id },
    );
};

// ---------- POST /vendor (create) ----------

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

export const useCreateVendor = () => {
    const mutation = useApiMutation<CreateCustomerResponse, CreateCustomerRequestBody>({
        method: 'POST',
        endPoint: 'vendor',
    });
    const createVendor = useCallback(
        ({ body }: CreateCustomerMutationPayload) => mutation.mutateAsync({ body }),
        [mutation],
    );
    return { ...mutation, createVendor };
};

// ---------- PATCH /vendor/:id (update) ----------

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

export const useUpdateVendor = () => {
    const mutation = useApiMutation<UpdateCustomerResponse, UpdateCustomerRequestBody>({
        method: 'PATCH',
        endPoint: 'vendor',
    });
    const updateVendor = useCallback(
        ({ id, body }: UpdateCustomerMutationPayload) =>
            mutation.mutateAsync({ endPoint: `vendor/${id}`, body }),
        [mutation],
    );
    return { ...mutation, updateVendor };
};

// ---------- DELETE /vendor/:id (delete) ----------

export interface DeleteCustomerResponse {
    success: boolean;
    message: string;
}

interface DeleteCustomerMutationPayload {
    id: string;
}

export const useDeleteVendor = () => {
    const mutation = useApiMutation<DeleteCustomerResponse>({
        method: 'DELETE',
        endPoint: '/vendor',
    });

    const deleteVendor = useCallback(
        ({ id }: DeleteCustomerMutationPayload) =>
            mutation.mutateAsync({ endPoint: `vendor/${id}` }),
        [mutation],
    );

    return { ...mutation, deleteVendor };
};