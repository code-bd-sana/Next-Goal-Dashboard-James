import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),

  endpoints: (builder) => ({
    getSingleUser: builder.query({
      query: (email) => `/user/getUser/${email}`, // you can adjust based on your API
    }),
    changePassword: builder.mutation({
      query:(body)=>({
        url:`/password/change`,
        method:"PUT",
        body:body

      })
    })
  }),
});

export const { useGetSingleUserQuery, useChangePasswordMutation } = UserApi;
