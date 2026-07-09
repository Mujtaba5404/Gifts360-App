/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import MainStack from './src/navigation/MainStack';
import { store } from './src/redux/store';

const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer>
              <MainStack />
              <Toast />
            </NavigationContainer>
          </SafeAreaProvider>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;