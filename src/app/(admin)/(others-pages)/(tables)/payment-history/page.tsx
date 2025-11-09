import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentHistory from '@/components/paymentHistory/PaymentHistory'
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title:
    "Next-Goal",
  description: "Next-Goal Dashboard",
};


export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Payment History" />
      <div className="space-y-6">
        <ComponentCard title="Payment History">

          <PaymentHistory/>
      
        </ComponentCard>
      </div>
    </div>
  );
}
