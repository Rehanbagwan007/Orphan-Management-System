import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"

import authSlice from "./slices/authSlice"
import donationSlice from "./slices/donationSlice"
import childrenSlice from "./slices/childrenSlice"
import adoptionSlice from "./slices/adoptionSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
}

const rootReducer = combineReducers({
  auth: authSlice,
  donations: donationSlice,
  children: childrenSlice,
  adoptions: adoptionSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)