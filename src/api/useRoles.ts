import { useApiMutation,useApiQuery } from '../services';


export interface Role {
  _id: string;
  title: string;
  scope: string;
  indexPath: string;
  permissions: Record<string, ResourcePermissions>;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetRolesResponse {
  data: Role[];
  meta: RolesMeta;
}

export interface GetRolesParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /roles (list) ----------

export const useRolesList = (params?: GetRolesParams) => {
  return useApiQuery<GetRolesResponse>(
    ['roles', params],
    {
      method: 'GET',
      endPoint: 'roles',
      requestConfig: { params },
    },
  );
};

// ---------- GET /roles/:id (single) ----------

export const useRole = (id?: string) => {
  return useApiQuery<{ data: Role }>(
    ['role', id],
    {
      method: 'GET',
      endPoint: `roles/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /roles (create) ----------

export interface ResourcePermissions {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
}

export interface CreateRolePayload {
  title: string;
  scope: string;
  indexPath: string;
  permissions: Record<string, ResourcePermissions>;
}

export interface CreateRoleResponse {
  data: Role;
  message?: string;
}

export const useCreateRole = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation
    <CreateRoleResponse,
    CreateRolePayload
  >({
    method: 'POST',
    endPoint: 'roles',
  });

  const createRole = (body: CreateRolePayload) => mutateAsync({ body });

  return { createRole, isPending, isError, error };
};

// ---------- PATCH /roles/:id (update) ----------

export interface UpdateRolePayload extends CreateRolePayload {
  id: string;
}

export interface UpdateRoleResponse {
  data: Role;
  message?: string;
}

export const useUpdateRole = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation
    <UpdateRoleResponse,
    CreateRolePayload
  >({
    method: 'PATCH',
    endPoint: 'roles',
  });

  const updateRole = ({ id, ...body }: UpdateRolePayload) =>
    mutateAsync({ endPoint: `roles/${id}`, body });

  return { updateRole, isPending, isError, error };
};

// ---------- DELETE /roles/:id ----------

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
}

export const useDeleteRole = () => {
  const { mutateAsync, isPending, isError, error } =
    useApiMutation<DeleteRoleResponse>({
      method: 'DELETE',
      endPoint: 'roles',
    });

  const deleteRole = ({ id }: { id: string }) =>
    mutateAsync({ endPoint: `roles/${id}` });

  return { deleteRole, isPending, isError, error };
};