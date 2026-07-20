import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

const LEGACY_PERSIST_ROOT_KEY = 'persist:root';
let hasPreparedPersistStorage = false;

export const persistStorage: Storage = {
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  getItem: key => AsyncStorage.getItem(key),
  removeItem: key => AsyncStorage.removeItem(key),
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const preparePersistStorage = async () => {
  if (hasPreparedPersistStorage) {
    return;
  }

  hasPreparedPersistStorage = true;

  try {
    const asyncStorageState = await AsyncStorage.getItem(LEGACY_PERSIST_ROOT_KEY);
    if (asyncStorageState != null) {
      return;
    }

    let legacyState: string | undefined;
    try {
      // react-native-mmkv v4 mein `new MMKV()` nahi chalta — ab createMMKV() hai.
      const legacyStorage = createMMKV();
      legacyState = legacyStorage.getString(LEGACY_PERSIST_ROOT_KEY);
    } catch (error) {
      return;
    }

    if (!legacyState) {
      return;
    }

    await AsyncStorage.setItem(LEGACY_PERSIST_ROOT_KEY, legacyState);

    if (__DEV__) {
      console.log('[persist] Migrated persisted Redux state from MMKV to AsyncStorage.');
    }
  } catch (error) {
    if (__DEV__) {
      console.error(
        `[persist] Failed to prepare AsyncStorage persistence. Reason: ${getErrorMessage(error)}`
      );
    }
  }
};