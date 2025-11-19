import { configureStore } from "@reduxjs/toolkit";
import { SubsciriptionApi } from "../feature/SubscriptionApi";

export const store = configureStore({
  reducer: {

    [SubsciriptionApi.reducerPath]: SubsciriptionApi.reducer,   
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        SubsciriptionApi.middleware,
    ]),
});
