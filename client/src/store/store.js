import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import companyReduer from "./slices/companySlice";
import invitationReducer from "./slices/invitation";
import userReducer from "./slices/userSlice";
import taskReducer from "./slices/taskSlice";
import dashboardReducer from "./slices/dashboardSlice";
import notificationReducer from "./slices/notificationSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReduer,
  invitation: invitationReducer,
  user: userReducer,
  task: taskReducer,
  dashboard: dashboardReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }), // ✅ No need to add thunk manually
});

export const persistor = persistStore(store);
