import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for subscription data


// Subscription data
const subscriptionData = [
  {
    id: 1,
    planName: "Premium Plan",
    price: "$29.99/month",
    startDate: "15 Jan, 2024",
    endDate: "15 Feb, 2024",
    status: "Active",
    paymentMethod: "Credit Card",
    nextBilling: "15 Feb, 2024",
  },
  {
    id: 2,
    planName: "Pro Plan",
    price: "$49.99/month",
    startDate: "10 Dec, 2023",
    endDate: "10 Jan, 2024",
    status: "Expired",
    paymentMethod: "PayPal",
    nextBilling: "-",
  },
  {
    id: 3,
    planName: "Basic Plan",
    price: "$19.99/month",
    startDate: "01 Nov, 2023",
    endDate: "01 Dec, 2023",
    status: "Canceled",
    paymentMethod: "Credit Card",
    nextBilling: "-",
  },
  {
    id: 4,
    planName: "Premium Plan",
    price: "$29.99/month",
    startDate: "20 Sep, 2023",
    endDate: "20 Oct, 2023",
    status: "Expired",
    paymentMethod: "Stripe",
    nextBilling: "-",
  },
  {
    id: 5,
    planName: "Enterprise Plan",
    price: "$99.99/month",
    startDate: "05 Jan, 2024",
    endDate: "05 Feb, 2024",
    status: "Active",
    paymentMethod: "Bank Transfer",
    nextBilling: "05 Feb, 2024",
  },
];

export default function SubscriptionDetails() {
  const currentSubscription = subscriptionData.find(sub => sub.status === "Active");

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Current Subscription
        </h3>
        
        {currentSubscription ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Plan Name</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {currentSubscription.planName}
              </p>
            </div>

            {/* Subscription Period */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Period</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {currentSubscription.startDate} - {currentSubscription.endDate}
              </p>
            </div>

            {/* Next Billing */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {currentSubscription.nextBilling}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <Badge
                size="sm"
                color={
                  currentSubscription.status === "Active"
                    ? "success"
                    : currentSubscription.status === "Pending"
                    ? "warning"
                    : currentSubscription.status === "Expired"
                    ? "error"
                    : "gray"
                }
              >
                {currentSubscription.status}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No active subscription found.</p>
          </div>
        )}
      </div>

      {/* Subscription History Table */}
      <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Subscription History
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your subscription timeline and history
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium text-gray-800 shadow-theme-xs hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFD700' }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Plan Name
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Start Date
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  End Date
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Payment Method
                </TableCell>
            
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {subscriptionData.map((subscription) => (
                <TableRow key={subscription.id} className="">
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {subscription.planName}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {subscription.price}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {subscription.startDate}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {subscription.endDate}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        subscription.status === "Active"
                          ? "success"
                          : subscription.status === "Pending"
                          ? "warning"
                          : subscription.status === "Expired"
                          ? "error"
                          : "gray"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {subscription.paymentMethod}
                  </TableCell>
             
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {subscriptionData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No subscription history found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 1 to 5 of 5 results
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFD700' }}
            >
              Previous
            </button>
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-gray-800 px-3 py-2 text-theme-sm font-medium text-gray-800 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFD700' }}
            >
              1
            </button>
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFD700' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}