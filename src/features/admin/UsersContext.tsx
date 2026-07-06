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
}

interface UsersContextValue {
  users: User[];
  addUser: (name: string, email: string) => void;
  updateUser: (id: string, name: string, email: string) => void;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const idRef = useRef(0);

  const value = useMemo<UsersContextValue>(
    () => ({
      users,
      addUser: (name, email) => {
        idRef.current += 1;
        setUsers(prev => [
          { id: String(idRef.current), name, email },
          ...prev,
        ]);
      },
      updateUser: (id, name, email) => {
        setUsers(prev =>
          prev.map(user => (user.id === id ? { ...user, name, email } : user)),
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
