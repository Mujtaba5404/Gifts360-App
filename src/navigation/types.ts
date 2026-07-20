/**
 * Navigation param lists for the app's navigators.
 * Keep route types here so screens can import them without importing the
 * navigator components (avoids circular imports).
 */
import { Expense } from '../api/useExpenses';
import { Customer } from '../api/useCustomer';
import { PettyCashRow } from '../features/pettyCash/types';
import { Vendor } from '../features/vendors/types';
import { PurchaseOrder } from '../api/usePurchaseOrders';

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
  PurchaseOrdersFlatList: undefined;
  CreatePurchaseOrder:undefined;
  PurchaseOrderDetailScreen:undefined;
  EditPurchaseOrder:{order: PurchaseOrder};
  SalesOrdersFlatList: undefined;
  ItemsFlatList: undefined;
};
