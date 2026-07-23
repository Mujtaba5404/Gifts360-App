import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useCreateRole, useUpdateRole,useRolesList,useDeleteRole,CreateRolePayload } from '../../api/useRoles';

export interface ResourcePermissions {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  title: string;
  scope: string;
  indexPath: string;
  permissions: Record<string, ResourcePermissions>;
}

type NewRole = Omit<Role, 'id'>;

interface RolesContextValue {
  roles: Role[];
  isLoading: boolean;
  isError: boolean;
  refetchRoles: () => void;
  addRole: (role: NewRole) => Promise<void>;
  updateRole: (id: string, changes: Partial<NewRole>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  isSubmitting: boolean;
}

const RolesContext = createContext<RolesContextValue | undefined>(undefined);

const toPayload = (role: NewRole | Partial<NewRole>): CreateRolePayload => ({
  title: role.title ?? '',
  scope: role.scope ?? '',
  indexPath: role.indexPath ?? '',
  permissions: role.permissions ?? {},
});

export const RolesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, refetch} = useRolesList();
  const { createRole, isPending: isCreating } = useCreateRole();
  const { updateRole: updateRoleApi, isPending: isUpdating } = useUpdateRole();
  const { deleteRole: deleteRoleApi, isPending: isDeleting } = useDeleteRole();

  const roles: Role[] = useMemo(
    () =>
      (data?.data ?? []).map(r => ({
        id: r._id,
        title: r.title,
        scope: r.scope,
        indexPath: r.indexPath,
        permissions: r.permissions,
      })),
    [data],
  );

  const addRole = useCallback(
    async (role: NewRole) => {
      await createRole(toPayload(role));
      refetch();
    },
    [createRole, refetch],
  );

  const updateRole = useCallback(
    async (id: string, changes: Partial<NewRole>) => {
      await updateRoleApi({ id, ...toPayload(changes) });
      refetch();
    },
    [updateRoleApi, refetch],
  );

  const deleteRole = useCallback(
    async (id: string) => {
      await deleteRoleApi({ id });
      refetch();
    },
    [deleteRoleApi, refetch],
  );

  const value = useMemo<RolesContextValue>(
    () => ({
      roles,
      isLoading,
      isError,
      refetchRoles: refetch,
      addRole,
      updateRole,
      deleteRole,
      isSubmitting: isCreating || isUpdating || isDeleting,
    }),
    [
      roles,
      isLoading,
      isError,
      refetch,
      addRole,
      updateRole,
      deleteRole,
      isCreating,
      isUpdating,
      isDeleting,
    ],
  );

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
};

export const useRoles = (): RolesContextValue => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};