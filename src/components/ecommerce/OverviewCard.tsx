"use client";
import React from "react";
import { 
  FaUsers, 
  FaCreditCard, 
  FaEnvelope, 
  FaCalendarAlt,
  FaPaperPlane,
  FaClock,
  FaCalendarTimes,
  FaMoneyBillWave
} from "react-icons/fa";

export const OverviewCards = () => {
  // Mock data - replace with actual data from your API
  const metricsData = {
    totalUsers: 15682,
    userChange: 12.5,
    userTrend: "up",
    
    totalSubscriptions: 8924,
    subscriptionChange: -3.2,
    subscriptionTrend: "down",
    
    totalPayments: 124759,
    paymentChange: 8.7,
    paymentTrend: "up",
    
    totalEmails: 456231,
    emailChange: 15.3,
    emailTrend: "up",

    // New metrics
    totalRevenue: 125649,
    revenueChange: 18.2,
    revenueTrend: "up",

    sendingLimit: 10000,
    limitUsed: 7234,
    limitChange: -2.1,
    limitTrend: "down",

    subscriptionEnd: 1542,
    endChange: 5.7,
    endTrend: "up",

    emailsSent: 89234,
    sentChange: 12.3,
    sentTrend: "up",
  };

  return (
    <div>
      {/* Temporary Text */}
      {/* <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          User Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your account metrics and performance
        </p>
      </div> */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {/* Total Users Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
            <FaUsers className="text-blue-600 size-6 dark:text-blue-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metricsData.totalUsers.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Subscriptions Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
            <FaCalendarAlt className="text-green-600 size-6 dark:text-green-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Subscriptions
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metricsData.totalSubscriptions.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Payments Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
            <FaCreditCard className="text-purple-600 size-6 dark:text-purple-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Payments
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ${metricsData.totalPayments.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Emails Sent Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
            <FaEnvelope className="text-orange-600 size-6 dark:text-orange-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Emails Sent
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metricsData.totalEmails.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* New Cards - Second Row */}

        {/* Total Revenue Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-900/20">
            <FaMoneyBillWave className="text-indigo-600 size-6 dark:text-indigo-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Cost
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                ${metricsData.totalRevenue.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Sending Limit Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/20">
            <FaPaperPlane className="text-red-600 size-6 dark:text-red-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Sending Limit
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metricsData.limitUsed.toLocaleString()}/{metricsData.sendingLimit.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

        {/* Subscription End Date Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl dark:bg-pink-900/20">
            <FaCalendarTimes className="text-pink-600 size-6 dark:text-pink-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Subscription Ending Soon
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            2/1/2026
              </h4>
            </div>
          </div>
        </div>

        {/* Emails Sent This Month Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl dark:bg-teal-900/20">
            <FaClock className="text-teal-600 size-6 dark:text-teal-400" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Emails Sent (This Month)
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metricsData.emailsSent.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};