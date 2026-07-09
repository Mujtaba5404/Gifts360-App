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
import { UsersProvider } from '../features/admin/UsersContext';
import BottomTabs from './BottomTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <UsersProvider>
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
          {/* <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} /> */}
        </Stack.Navigator>
      </RolesProvider>
    </UsersProvider>
  );
};

export default MainStack;
