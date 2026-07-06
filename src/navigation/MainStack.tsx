import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignInEmail from '../features/auth/SignInEmail';
import EditUser from '../features/admin/EditUser';
import Users from '../features/admin/Users';
import { UsersProvider } from '../features/admin/UsersContext';
import BottomTabs from './BottomTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <UsersProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignInEmail" component={SignInEmail} />
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="EditUser" component={EditUser} />
      </Stack.Navigator>
    </UsersProvider>
  );
};

export default MainStack;
