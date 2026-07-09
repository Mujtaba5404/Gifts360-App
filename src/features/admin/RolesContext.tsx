import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  addRole: (role: NewRole) => void;
  updateRole: (id: string, changes: Partial<NewRole>) => void;
}

const RolesContext = createContext<RolesContextValue | undefined>(undefined);

export const RolesProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const idRef = useRef(0);

  const value = useMemo<RolesContextValue>(
    () => ({
      roles,
      addRole: role => {
        idRef.current += 1;
        setRoles(prev => [{ id: String(idRef.current), ...role }, ...prev]);
      },
      updateRole: (id, changes) => {
        setRoles(prev =>
          prev.map(role => (role.id === id ? { ...role, ...changes } : role)),
        );
      },
    }),
    [roles],
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
