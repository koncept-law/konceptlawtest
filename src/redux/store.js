import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

import campaignsReducer from "./features/campaigns";
import loadersReducer from "./features/loaders";
import userReducer from "./features/user";
import documentReducer from "./features/document";
import miscellaneousReducer from "./features/miscellaneous";
import authReducer from "./features/auth";
import progressReducer from "./features/progress";
import notification from "./features/notification";

const rootReducer = combineReducers({
  auth: authReducer,
  campaigns: campaignsReducer,
  loaders: loadersReducer,
  user: userReducer,
  document: documentReducer,
  miscellaneous: miscellaneousReducer,
  progress: progressReducer,
  notification: notification,
});

const persistConfig = {
  key: "root",
  storage,
  // Add any blacklist or whitelist configurations as needed
  whitelist: ["campaigns"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
