import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  brands: string[];
  usesBrandAliases: boolean;
  role: string;
  isActive: boolean;
}

type NewUser = Omit<User, 'id'>;

interface UsersContextValue {
  users: User[];
  addUser: (user: NewUser) => void;
  updateUser: (id: string, changes: Partial<NewUser>) => void;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const idRef = useRef(0);

  const value = useMemo<UsersContextValue>(
    () => ({
      users,
      addUser: user => {
        idRef.current += 1;
        setUsers(prev => [{ id: String(idRef.current), ...user }, ...prev]);
      },
      updateUser: (id, changes) => {
        setUsers(prev =>
          prev.map(user => (user.id === id ? { ...user, ...changes } : user)),
        );
      },
    }),
    [users],
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextValue => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
