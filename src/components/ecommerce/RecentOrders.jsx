'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAdminLatestPaymentHistoryQuery, useLatestPaymentHistoryQuery } from "@/feature/SubscriptionApi";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Define the TypeScript interface for payment data


export default function RecentPayments() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const role = session?.user?.role;
  
  console.log(email, "email re email");
  console.log(role, "user role");
  
  // User payment history query
  const { 
    data: paymentHistory, 
    isLoading, 
    error, 
    isError 
  } = useLatestPaymentHistoryQuery(email, {
    skip: !email || role === "admin",
  });

  // Admin payment history query  
  const {
    data: adminLatestPayment, 
    isLoading: adminLatestPaymentLoading, 
    error: adminLatestPaymentError, 
    isError: adminLatestPaymentIsError
  } = useAdminLatestPaymentHistoryQuery(undefined, {
    skip: role !== "admin",
  });  

  console.log(adminLatestPayment, "admin latest payment");
  
  if(isError){
    console.log(error, "error in recent payment");
  }
  
  console.log(paymentHistory?.data, "tomi to payment history");

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "gray";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  // Determine which data to use based on role
  let paymentData = [];
  let isLoadingData = false;
  let isErrorData = false;

  if (role === "admin") {
    paymentData = adminLatestPayment?.data || [];
    isLoadingData = adminLatestPaymentLoading;
    isErrorData = adminLatestPaymentIsError;
  } else {
    paymentData = paymentHistory?.data || [];
    isLoadingData = isLoading;
    isErrorData = isError;
  }

  if (isLoadingData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Payments
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading payments...</div>
        </div>
      </div>
    );
  }

  if (isErrorData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Payments
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading payments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Payments
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {role === "admin" ? "All Users' Recent Payments" : "Your Recent Payments"} - {paymentData.length} transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
        <Link href={'/users'}>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {role === "admin" && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User Email
                </TableCell>
              )}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Plan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment Method
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paymentData.map((payment) => (
              <TableRow key={payment._id} className="">
                {/* Show user email only for admin */}
                {role === "admin" && (
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {payment.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {payment.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                )}
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {payment.plan?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {payment.plan || 'Unknown Plan'}
                      </p>
                      {role !== "admin" && (
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {formatDate(payment.startDate)} - {formatDate(payment.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {formatAmount(payment.price)}
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(payment.createdAt)}
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  Stripe
                </TableCell>
                
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getStatusColor(payment.paymentStatus)}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paymentData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {role === "admin" ? "No recent payments found from any users." : "No recent payments found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}