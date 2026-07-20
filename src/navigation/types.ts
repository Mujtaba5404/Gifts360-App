/**
 * Navigation param lists for the app's navigators.
 * Keep route types here so screens can import them without importing the
 * navigator components (avoids circular imports).
 */
// Route params hamesha API ke asal types use karte hain — features/*/types.ts
// wale purane shapes server ke response se match nahi karte the.
import { Expense } from '../api/useExpenses';
import { Customer } from '../api/useCustomer';
import { PettyCash } from '../api/usePettyCash';
import { Vendor } from '../api/useVendor';

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
  EditPettyCash: { entry: PettyCash };
  PettyCash: undefined;
  Customers: undefined;
  CreateCustomer: undefined;
  EditCustomer: { customer: Customer };
  CustomerDetailScreen: { customerId: string };
  Vendors: undefined;
  CreateVendor: undefined;
  EditVendor: { vendor: Vendor };
  VendorDetailScreen: { vendorId: string };
  PurchaseOrdersFlatList: undefined;
  CreatePurchaseOrder: undefined;
  PurchaseOrderDetailScreen: { orderId: string };
  EditPurchaseOrder: { orderId: string };
  SalesOrdersFlatList: undefined;
  CreateSalesOrder: undefined;
  SalesOrderDetailScreen: { orderId: string };
  EditSalesOrder: { orderId: string };
  ItemsFlatList: undefined;
  CreateItem: undefined;
  ItemDetailScreen: { itemId: string };
  EditItem: { itemId: string };
  PayrollsFlatList: undefined;
  CreatePayroll: undefined;
  PayrollDetailScreen: { payrollId: string };
  EditPayroll: { payrollId: string };
};
