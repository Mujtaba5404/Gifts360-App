import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignInEmail from '../features/auth/SignInEmail';
import Home from '../features/home/Home';
import BottomTabs from './BottomTabs';
import Profile from '../features/auth/Profile';


export type StackParamList = {
  SignInEmail: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const MainStack: React.FC = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="SignInEmail" component={SignInEmail} /> 
      <Stack.Screen name="Home" component={BottomTabs} /> 
      <Stack.Screen name="Profile" component={Profile} /> 
    </Stack.Navigator>
  );
};

export default MainStack;