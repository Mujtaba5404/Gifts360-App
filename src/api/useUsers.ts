import { useApiMutation, useApiQuery } from '../services';

export interface UserRole {
  _id: string;
  title: string;
}

/**
 * Login response `username` bhejta hai, jabke populated user refs (pettyCash,
 * salesOrders) `name` bhejte hain — is liye dono optional rakhe hain aur
 * display ke liye `getUserName()` use karte hain.
 */
export interface AppUser {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  brands?: string[];
  usesBrandAliases?: boolean;
  /** Kabhi plain id/string, kabhi populated object. */
  role?: UserRole | string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getUserName = (user?: Pick<AppUser, 'name' | 'username'>) =>
  user?.name || user?.username || '';

export const getUserRoleId = (role?: AppUser['role']) => {
  if (!role) return '';
  return typeof role === 'string' ? role : role._id;
};

export const getUserRoleTitle = (role?: AppUser['role']) => {
  if (!role) return '';
  return typeof role === 'string' ? role : role.title;
};

export interface UsersMeta {
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface GetUsersResponse {
  data: AppUser[];
  meta: UsersMeta;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// ---------- GET /users (list) ----------

export const useUsers = (params?: GetUsersParams) => {
  return useApiQuery<GetUsersResponse>(
    ['users', params],
    {
      method: 'GET',
      endPoint: 'users',
      requestConfig: { params },
    },
  );
};

// ---------- GET /users/:id (single) ----------

export const useUser = (id?: string) => {
  return useApiQuery<{ data: AppUser }>(
    ['user', id],
    {
      method: 'GET',
      endPoint: `users/${id}`,
    },
    { enabled: !!id },
  );
};

// ---------- POST /users (create) ----------

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  brands?: string[];
  usesBrandAliases?: boolean;
  role?: string;
  isActive?: boolean;
}

export interface CreateUserResponse {
  data: AppUser;
  message?: string;
}

export const useCreateUser = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    CreateUserResponse,
    CreateUserPayload
  >({
    method: 'POST',
    endPoint: 'users',
  });

  const createUser = (body: CreateUserPayload) => mutateAsync({ body });

  return { createUser, isPending, isError, error };
};

// ---------- PATCH /users/:id (update) ----------

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string;
}

export interface UpdateUserResponse {
  data: AppUser;
  message?: string;
}

export const useUpdateUser = () => {
  const { mutateAsync, isPending, isError, error } = useApiMutation<
    UpdateUserResponse,
    Partial<CreateUserPayload>
  >({
    method: 'PATCH',
    endPoint: 'users',
  });

  // Baaki hooks ki tarhan id endPoint mein jati hai — mutation variables mein
  // `id` naam ka koi field support nahi hota.
  const updateUser = ({ id, ...body }: UpdateUserPayload) =>
    mutateAsync({ endPoint: `users/${id}`, body });

  return { updateUser, isPending, isError, error };
};

// ---------- DELETE /users/:id ----------

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const useDeleteUser = () => {
  const { mutateAsync, isPending, isError, error } =
    useApiMutation<DeleteUserResponse>({
      method: 'DELETE',
      endPoint: 'users',
    });

  const deleteUser = ({ id }: { id: string }) =>
    mutateAsync({ endPoint: `users/${id}` });

  return { deleteUser, isPending, isError, error };
};
