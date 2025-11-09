import AllUsers from '@/components/users/AllUser';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title:
    "Next-Goal",
  description: "Next-Goal Dashboard",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="All Users" />

    <AllUsers/>
      
          </div>
  );
}
