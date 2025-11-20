import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { base_url } from "../utils/utils"
export const SubsciriptionApi = createApi({
    reducerPath: "SubsciriptionApi",
    baseQuery: fetchBaseQuery({baseUrl: base_url}),
    tagTypes: ["Subscription"],
    endpoints:(builder) =>({
        createSubscription:builder.mutation({
            query:(data)=>({
                url:"/payment/createLink/",
                method:"POST",
                body:data,


            })
        }),
        mySubscription:builder.query({
            query:(email)=>`/subscription/my-subscripton/${email}`,
            providesTags:["Subscription"]
        })
    })
});

export const {useCreateSubscriptionMutation, useMySubscriptionQuery} = SubsciriptionApi