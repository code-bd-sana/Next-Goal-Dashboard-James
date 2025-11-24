'use client'
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from 'next/link';
import { useCancelSubscriptionMutation, useMySubscriptionQuery } from '@/feature/SubscriptionApi';
import { useSession } from 'next-auth/react';
import { useMyAllSubscriptionsQuery } from '../../feature/SubscriptionApi';
import toast from 'react-hot-toast';

// Define the TypeScript interface for subscription data


export default function SubscriptionDetails() {
  const [isCancelling, setIsCancelling] = useState(false);

  const userdata = useSession();
  if (userdata?.status === 'loading') {
    return <div>Loading...</div>;
  }

  const { data: allSubscription, isError, error: allSubscriptionError } = useMyAllSubscriptionsQuery(userdata?.data?.user?.email, { skip: userdata?.status !== 'authenticated' });

  if (allSubscriptionError) {
    console.log(allSubscriptionError, "this is all subscription error")
  }
  console.log(allSubscription?.data, 'this is all subscription');
  const subscriptionData = allSubscription?.data || [];

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const currentSubscription = subscriptionData.find(sub => sub.status === "active");
  console.log(userdata?.data?.user?.email, "This is user email")
  
  const { data: subscription, isLoading, error } = useMySubscriptionQuery(userdata?.data?.user?.email, { skip: userdata?.status !== 'authenticated' });
  const { data: allSubscriptions } = useMyAllSubscriptionsQuery(userdata?.data?.user?.email, { skip: userdata?.status !== 'authenticated' });
  console.log(allSubscriptions, "all my subscription is here")

  const data = subscription?.subscription;
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();


  // ✅ Cancel Subscription Handler
  const handleCancelSubscription = async (subscription) => {
    try {
      setIsCancelling(true);
      const userEmail = subscription.email;
      const stripeSubscriptionId = subscription.stripeSubscriptionId;
      
      console.log('🔄 Cancelling subscription for email:', userEmail);
      console.log('📋 Stripe Subscription ID:', stripeSubscriptionId);
      
      // Here you would typically call your API to cancel subscription
      // For now, just log the email and stripeSubscriptionId to console
      console.log('📧 Email sent for cancellation:', userEmail);
      console.log('💳 Stripe Subscription ID for cancellation:', stripeSubscriptionId);
      const data = {
        email: userEmail,
        id: stripeSubscriptionId
      }

      await cancelSubscription(data).unwrap();
      toast.success('✅ Subscription cancelled successfully!');
      
      // Simulate API call delay

 
      
    } catch (error) {
      console.error('❌ Error cancelling subscription:', error);
     
    } finally {
      setIsCancelling(false);
    }
  };

  // ✅ Confirm before cancellation
  const confirmCancelSubscription = (subscription) => {
    const userEmail = subscription.email;
    const stripeSubscriptionId = subscription.stripeSubscriptionId;
    
    if (window.confirm(`Are you sure you want to cancel your subscription for ${userEmail}?\n\nPlan: ${subscription.plan}\nStripe ID: ${stripeSubscriptionId}`)) {
      handleCancelSubscription(subscription);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Current Subscription
          </h3>
          
          {/* ✅ Cancel Subscription Button - Only show if current subscription is active */}
          {currentSubscription && currentSubscription.status === "active" && (
            <button 
              onClick={() => confirmCancelSubscription(currentSubscription)}
              disabled={isCancelling}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-theme-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCancelling ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cancel Subscription
                </>
              )}
            </button>
          )}
        </div>
        
        {currentSubscription ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Plan Name</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {currentSubscription.plan}
              </p>
            </div>

            {/* Subscription Period */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Period</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {formatDate(currentSubscription.startDate)} - {formatDate(currentSubscription.endDate)}
              </p>
            </div>

            {/* Next Billing */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing</p>
              <p className="font-semibold text-gray-800 dark:text-white/90">
                {formatDate(currentSubscription.endDate)} 
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <Badge
                size="sm"
                color={
                  currentSubscription.status === "active"
                    ? "success"
                    : currentSubscription.status === "pending"
                    ? "warning"
                    : currentSubscription.status === "expired"
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
            <Link href={'/subscription-details/upgrade-plan'}>
              <button 
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium text-gray-800 shadow-theme-xs hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FFD700' }}
              >
                Upgrade Plan
              </button>
            </Link>
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
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {subscriptionData.map((subscription) => (
                <TableRow key={subscription.id} className="">
                  <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {subscription.plan}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    ${subscription.price}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(subscription.startDate)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(subscription.endDate)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={
                        subscription.status === "active"
                          ? "success"
                          : subscription.status === "pending"
                          ? "warning"
                          : subscription.status === "expired"
                          ? "error"
                          : "gray"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    Stripe
                  </TableCell>
                  <TableCell className="py-3">
                    {/* ✅ Cancel button only for active subscriptions in the table */}
                    {subscription.status === "active" && (
                      <button 
                        onClick={() => confirmCancelSubscription(subscription)}
                        disabled={isCancelling}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isCancelling ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancel
                          </>
                        )}
                      </button>
                    )}
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
            Showing 1 to {subscriptionData.length} of {subscriptionData.length} results
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