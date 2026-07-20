import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignInEmail from '../features/auth/SignInEmail';
import CreateRole from '../features/admin/CreateRole';
import CreateUser from '../features/admin/CreateUser';
import EditRole from '../features/admin/EditRole';
import EditUser from '../features/admin/EditUser';
import Roles from '../features/admin/Roles';
import { RolesProvider } from '../features/admin/RolesContext';
import Users from '../features/admin/Users';
import BottomTabs from './BottomTabs';
import { RootStackParamList } from './types';
import ExpensesFlatList from '../features/expenses/ExpensesFlatList';
import CreateExpenses from '../features/expenses/CreateExpenses';
import EditExpenses from '../features/expenses/EditExpenses';
import PettyCashFlatList from '../features/pettyCash/PettyCashFlatList';
import CreatePettyCash from '../features/pettyCash/CreatePettyCash';
import EditPettyCash from '../features/pettyCash/EditPettyCash';
import CustomersFlatList from '../features/customers/CustomersFlatList';
import CreateCustomer from '../features/customers/CreateCustomer';
import EditCustomer from '../features/customers/EditCustomer';
import CustomerDetailScreen from '../features/customers/CustomerDetailScreen';
import VendorsFlatList from '../features/vendors/VendorsFlatList';
import CreateVendor from '../features/vendors/CreateVendor';
import EditVendor from '../features/vendors/EditVendor';
import VendorDetailScreen from '../features/vendors/VendorDetailScreen';
import ChangePasswordScreen from '../features/auth/ChangePasswordScreen';
import PurchaseOrdersFlatList from '../features/purchaseOrders/PurchaseOrdersFlatList';
import SalesOrdersFlatList from '../features/salesOrders/SalesOrdersFlatList';
import CreateSalesOrder from '../features/salesOrders/CreateSalesOrder';
import SalesOrderDetailScreen from '../features/salesOrders/SalesOrderDetailScreen';
import EditSalesOrder from '../features/salesOrders/EditSalesOrder';
import ItemsFlatList from '../features/items/ItemsFlatList';
import CreateItem from '../features/items/CreateItem';
import ItemDetailScreen from '../features/items/ItemDetailScreen';
import EditItem from '../features/items/EditItem';
import PayrollsFlatList from '../features/payrolls/PayrollsFlatList';
import CreatePayroll from '../features/payrolls/CreatePayroll';
import PayrollDetailScreen from '../features/payrolls/PayrollDetailScreen';
import EditPayroll from '../features/payrolls/EditPayroll';
import CreatePurchaseOrder from '../features/purchaseOrders/CreatePurchaseOrder';
import EditPurchaseOrder from '../features/purchaseOrders/EditPurchaseOrder';
import PurchaseOrderDetailScreen from '../features/purchaseOrders/PurchaseOrderDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <RolesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignInEmail" component={SignInEmail} />
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="Roles" component={Roles} />
        <Stack.Screen name="CreateRole" component={CreateRole} />
        <Stack.Screen name="EditRole" component={EditRole} />
        <Stack.Screen name="CreateExpenses" component={CreateExpenses} />
        <Stack.Screen name="EditExpenses" component={EditExpenses} />
        <Stack.Screen name="ExpensesFlatList" component={ExpensesFlatList} />
        <Stack.Screen name="CreatePettyCash" component={CreatePettyCash} />
        <Stack.Screen name="EditPettyCash" component={EditPettyCash} />
        <Stack.Screen name="PettyCash" component={PettyCashFlatList} />
        <Stack.Screen name="Customers" component={CustomersFlatList} />
        <Stack.Screen name="CreateCustomer" component={CreateCustomer} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} />
        <Stack.Screen
          name="CustomerDetailScreen"
          component={CustomerDetailScreen}
        />
        <Stack.Screen name="Vendors" component={VendorsFlatList} />
        <Stack.Screen name="CreateVendor" component={CreateVendor} />
        <Stack.Screen name="EditVendor" component={EditVendor} />
        <Stack.Screen
          name="VendorDetailScreen"
          component={VendorDetailScreen}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen
          name="PurchaseOrdersFlatList"
          component={PurchaseOrdersFlatList}
        />
        <Stack.Screen
          name="CreatePurchaseOrder"
          component={CreatePurchaseOrder}
        />
        <Stack.Screen
          name="PurchaseOrderDetailScreen"
          component={PurchaseOrderDetailScreen}
        />
        <Stack.Screen name="EditPurchaseOrder" component={EditPurchaseOrder} />
        <Stack.Screen
          name="SalesOrdersFlatList"
          component={SalesOrdersFlatList}
        />
        <Stack.Screen name="CreateSalesOrder" component={CreateSalesOrder} />
        <Stack.Screen
          name="SalesOrderDetailScreen"
          component={SalesOrderDetailScreen}
        />
        <Stack.Screen name="EditSalesOrder" component={EditSalesOrder} />
        <Stack.Screen name="ItemsFlatList" component={ItemsFlatList} />
        <Stack.Screen name="CreateItem" component={CreateItem} />
        <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
        <Stack.Screen name="EditItem" component={EditItem} />
        <Stack.Screen name="PayrollsFlatList" component={PayrollsFlatList} />
        <Stack.Screen name="CreatePayroll" component={CreatePayroll} />
        <Stack.Screen
          name="PayrollDetailScreen"
          component={PayrollDetailScreen}
        />
        <Stack.Screen name="EditPayroll" component={EditPayroll} />
      </Stack.Navigator>
    </RolesProvider>
  );
};

export default MainStack;
