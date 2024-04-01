import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from "../redux/account/accountSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import orderReducer from '../redux/order/orderSlice';
import bookReducer from '../redux/book/bookSlice'
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'] //account will not be persisted
}

const rootReducer = combineReducers({
  account: accountReducer,
  order: orderReducer,
  book: bookReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor };

