import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const TemplateApi = createApi({
reducerPath: "TemplateApi",
baseQuery: fetchBaseQuery({
baseUrl: base_url,
prepareHeaders: (headers) => {
headers.set("Content-Type", "application/json");
return headers;
}
}),
tagTypes: ["Templates"], // ⚡️ Important

endpoints: (builder) => ({
// GET single user
getSingleUserTemplate: builder.query({
query: (email) => `/template/${email}`,
providesTags: ["Templates"], // ⚡️ mark this query as providing 'Templates' tag
}),


// SAVE EMAIL TEMPLATE (MUTATION)
saveEmailTemplate: builder.mutation({
  query: (data) => ({
    url: `/template/`,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Templates"], // ⚡️ after saving, invalidate 'Templates' to refetch
}),
editEmailTemplate: builder.mutation({
  query: (data) => ({
    url: `/template/edit`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Templates"], // ⚡️ after saving, invalidate 'Templates' to refetch
}),
deleteEmailTemplate: builder.mutation({
query: (id) => ({
url: `/template/delete/${id}`,
method: "DELETE",

}),
invalidatesTags: ["Templates"],
}),



}),
});

export const {
useGetSingleUserTemplateQuery,
useSaveEmailTemplateMutation,
useEditEmailTemplateMutation,
useDeleteEmailTemplateMutation
} = TemplateApi;
