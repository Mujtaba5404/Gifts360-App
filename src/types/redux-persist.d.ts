/**
 * redux-persist v6 ke bundled types adhoore hain: `persistStore` runtime par
 * `manualPersist` option support karta hai (lib/persistStore.js) lekin
 * PersistorOptions mein wo declare nahi hai. Yahan usko add kar rahe hain.
 */
import 'redux-persist';

declare module 'redux-persist/es/types' {
  interface PersistorOptions {
    manualPersist?: boolean;
  }
}
