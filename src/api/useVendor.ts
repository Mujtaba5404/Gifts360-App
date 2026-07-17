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

export interface Vendor {
    _id: string;
    title: string;
    email?: string;
    phone?: string;
    secondaryPhone?: string;
    address?: Address;
    type?: string;
    vendorPercentage?: number;
    categories?: string[];
    services?: string[];
    createdBy?: string;
}

export interface VendorsMeta {
    totalCount: number;
    totalPages: number;
    page: number;
    pageSize: number;
}

export interface GetVendorsResponse {
    data: Vendor[];
    meta: VendorsMeta;
}

export interface GetVendorsParams {
    page?: number;
    pageSize?: number;
    sort?: string;
}

// ---------- GET /vendors (list) ----------

export const useVendors = (params?: GetVendorsParams) => {
    return useApiQuery<GetVendorsResponse>(
        ['vendor', params],
        {
            method: 'GET',
            endPoint: 'vendors',
            requestConfig: { params },
        },
    );
};

// ---------- GET /vendor/:id (single) ----------

export const useVendor = (id: string) => {
    return useApiQuery<{ success: boolean; data: Vendor }>(
        ['vendor', id],
        {
            method: 'GET',
            endPoint: `vendors/${id}`,
        },
        { enabled: !!id },
    );
};

// ---------- POST /vendor (create) ----------

export interface CreateVendorRequestBody {
    title: string;
    email?: string;
    phone?: string;
    secondaryPhone?: string;
    address?: Address;
    type?: string;
    vendorPercentage?: number;
    categories?: string[];
    services?: string[];
}

export interface CreateVendorResponse {
    success: boolean;
    message: string;
    data: Vendor;
}

interface CreateVendorMutationPayload {
    body: CreateVendorRequestBody;
}

export const useCreateVendor = () => {
    const mutation = useApiMutation<CreateVendorResponse, CreateVendorRequestBody>({
        method: 'POST',
        endPoint: 'vendors',
    });
    const createVendor = useCallback(
        ({ body }: CreateVendorMutationPayload) => mutation.mutateAsync({ body }),
        [mutation],
    );
    return { ...mutation, createVendor };
};

// ---------- PATCH /vendor/:id (update) ----------

export type UpdateVendorRequestBody = Partial<CreateVendorRequestBody>;

export interface UpdateVendorResponse {
    success: boolean;
    message: string;
    data: Vendor;
}

interface UpdateVendorMutationPayload {
    id: string;
    body: UpdateVendorRequestBody;
}

export const useUpdateVendor = () => {
    const mutation = useApiMutation<UpdateVendorResponse, UpdateVendorRequestBody>({
        method: 'PATCH',
        endPoint: 'vendors',
    });
    const updateVendor = useCallback(
        ({ id, body }: UpdateVendorMutationPayload) =>
            mutation.mutateAsync({ endPoint: `vendors/${id}`, body }),
        [mutation],
    );
    return { ...mutation, updateVendor };
};

// ---------- DELETE /vendor/:id (delete) ----------

export interface DeleteVendorResponse {
    success: boolean;
    message: string;
}

interface DeleteVendorMutationPayload {
    id: string;
}

export const useDeleteVendor = () => {
    const mutation = useApiMutation<DeleteVendorResponse>({
        method: 'DELETE',
        endPoint: 'vendors',
    });

    const deleteVendor = useCallback(
        ({ id }: DeleteVendorMutationPayload) =>
            mutation.mutateAsync({ endPoint: `vendors/${id}` }),
        [mutation],
    );

    return { ...mutation, deleteVendor };
};