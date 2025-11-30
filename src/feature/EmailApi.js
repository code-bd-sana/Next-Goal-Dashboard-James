// feature/EmailApi.js
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const EmailApi = createApi({
  reducerPath: "EmailApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['Email'],

  endpoints: (builder) => ({
    sendEmail: builder.mutation({
      query: (data) => ({
        url: "/email/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Email'],
    }),
    myEmail: builder.query({
      query: ({ email, page = 1, limit = 10, search = '', status = '', dateFilter = '' }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (dateFilter) params.append('dateFilter', dateFilter);
        
        return `/email/${email}?${params.toString()}`;
      },
      providesTags: ['Email'],
    }),
    myPlan: builder.query({
      query:(email)=>`email/checkLimit/${email}`
    })
  }),
});

export const { useSendEmailMutation, useMyEmailQuery, useMyPlanQuery } = EmailApi;