import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import { persistStorage, preparePersistStorage } from './persistStorage';
import authReducer from './slice/authSlice';
import roleReducer from './slice/roleSlice';
import screenReducer from './slice/screenSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export interface RootState {
  role: ReturnType<typeof roleReducer>;
  screen: ReturnType<typeof screenReducer>;
  auth: ReturnType<typeof authReducer>;
}

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['auth', 'role', 'activeRide'],
};

const rootReducer = combineReducers({
  role: roleReducer,
  screen: screenReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store, { manualPersist: true });
void preparePersistStorage().finally(() => {
  persistor.persist();
});
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;