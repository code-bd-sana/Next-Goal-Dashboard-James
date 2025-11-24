import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "../utils/utils";

export const SubsciriptionApi = createApi({
  reducerPath: "SubsciriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/payment/createLink/",
        method: "POST",
        body: data,
      }),
    }),

    mySubscription: builder.query({
      query: (email) => `/subscription/my-subscripton/${email}`,
      providesTags: ["Subscription"],
    }),

    myAllSubscriptions: builder.query({
      query: (email) => `/subscription/all-subscriptions/${email}`,
      providesTags: ["Subscription"],
    }),

    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription/cancel-subscription",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    usreOverviw:builder.query({
      query:(email) => `payment/overview/${email}`,
      providesTags: ["Subscription"],
    }),

    myStatistics:builder.query({
      query:(email) => `payment/statistics/${email}`,
      providesTags: ["Subscription"],
    }),

    latestPaymentHistory:builder.query({
      query:(email) => `payment/latest-payment/${email}`,
      providesTags: ["Subscription"],
    }),
    myAllPaymentHistory:builder.query({
      query:(email) => `payment/all-payment-history/${email}`,
      providesTags: ["Subscription"],
    }),
    adminOverview:builder.query({
      query:() => `payment/admin-overview/`,
      providesTags: ["Subscription"],
    }),
    adminLatestPaymentHistory:builder.query({
      query:() => `payment/latestPayments/`,
      providesTags: ["Subscription"],
    }),
    adminAllPaymentHistory:builder.query({
      query:() => `payment/admin-allPaymentsHistory/`,
      providesTags: ["Subscription"],
    }),
    allUser : builder.query({
      query: () => `user/allUser`,
      providesTags: ["Subscription"],
    }),
    adminOverviewStatistics: builder.query({
      
      query:()=> `/payment/admin-statistics`,
      providesTags:['Subscription']


    })
  }),
});

// ✅ Correct exported hooks
export const {
  useCreateSubscriptionMutation,
  useMySubscriptionQuery,
  useMyAllSubscriptionsQuery,
  useCancelSubscriptionMutation,
    useUsreOverviwQuery,  
    useMyStatisticsQuery,
    useLatestPaymentHistoryQuery,
    useMyAllPaymentHistoryQuery,
    useAdminOverviewQuery,
    useAdminLatestPaymentHistoryQuery,
    useAdminAllPaymentHistoryQuery,
    useAllUserQuery,
    useAdminOverviewStatisticsQuery
} = SubsciriptionApi;
