import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CoachApi = createApi({
  reducerPath: "CoachApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ["Coach"],
  endpoints: (builder) => ({
    // Get all coaches with filters and pagination
    getAllCoaches: builder.query({
      query: ({ page = 1, limit = 10, search = "", gender = "", division = "", conference = "" }) => ({
        url: "/coach",
        params: { page, limit, search, gender, division, conference }
      }),
      providesTags: ["Coach"],
    }),

    // Save or update coach
    saveCoach: builder.mutation({
      query: (coachData) => ({
        url: "/coach",
        method: "POST",
        body: coachData,
      }),
      invalidatesTags: ["Coach"],
    }),

    // Edit existing coach by ID
    editCoach: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coach/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coach"],
    }),

    // Delete coach
    deleteCoach: builder.mutation({
      query: (id) => ({
        url: `/coach/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coach"],
    }),
  }),
});

export const {
  useGetAllCoachesQuery,
  useSaveCoachMutation,
  useEditCoachMutation,
  useDeleteCoachMutation,
} = CoachApi;