/**
 * Navigation param lists for the app's navigators.
 * Keep route types here so screens can import them without importing the
 * navigator components (avoids circular imports).
 */
import { Expense } from '../api/useExpenses';
import { Customer } from '../features/customers/types';
import { PettyCashRow } from '../features/pettyCash/types';
import { Vendor } from '../features/vendors/types';

export type RootStackParamList = {
  SignInEmail: undefined;
  Home: undefined;
  Users: undefined;
  CreateUser: undefined;
  EditUser: { userId: string };
  Roles: undefined;
  CreateRole: undefined;
  EditRole: { roleId: string };
  ChangePasswordScreen: undefined;
  CreateExpenses: undefined;
  EditExpenses: { expense: Expense };
  ExpensesFlatList: undefined;
  CreatePettyCash: undefined;
  EditPettyCash: { entry: PettyCashRow };
  PettyCash: undefined;
  Customers: undefined;
  CreateCustomer: undefined;
  EditCustomer: { customer: Customer };
  Vendors: undefined;
  CreateVendor: undefined;
  EditVendor: { vendor: Vendor };
};
