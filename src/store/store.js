import { configureStore } from "@reduxjs/toolkit";
import { SubsciriptionApi } from "../feature/SubscriptionApi";
import { UserApi } from "@/feature/UserApi";
import { TemplateApi } from "@/feature/TemplateApi";
import {CoachApi} from '@/feature/CoachApi'

export const store = configureStore({
  reducer: {
    [SubsciriptionApi.reducerPath]: SubsciriptionApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [TemplateApi.reducerPath]: TemplateApi.reducer,
    [ CoachApi.reducerPath] : CoachApi.reducer
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      SubsciriptionApi.middleware,
      UserApi.middleware,
      TemplateApi.middleware,
      CoachApi.middleware
    ]),
});
