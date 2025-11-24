"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useAdminOverviewStatisticsQuery, useMyStatisticsQuery } from "@/feature/SubscriptionApi";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const [activeTab, setActiveTab] = useState("admin");

  const { data: session } = useSession();
  const role = session?.user?.role;
  const email = session?.user?.email;

  const { data: statistics, isLoading, error } = useMyStatisticsQuery(email, {
    skip: !email || role === "admin",
  });

  const { data: adminOverview, error: adminError, isLoading: adminLoading } = useAdminOverviewStatisticsQuery();

  console.log(adminOverview, "This is admin overview");
  console.log(statistics?.monthlyData, "Monthly data from API");

  // Admin Chart Data (Dynamic - uses real data from API)
  const adminOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: adminOverview?.monthlyData?.map(item => item.month) || [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: function(val) {
          return val.toLocaleString();
        }
      },
      title: {
        text: "Amount ($)",
        style: {
          fontSize: "12px",
          color: "#6B7280",
        },
      },
    },
  };

  // Use real admin data for series
  const adminSeries = [
    {
      name: "",
      data: adminOverview?.monthlyData?.map(item => item.sales || 0) || 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "",
      data: adminOverview?.monthlyData?.map(item => item.revenue || 0) || 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  // User Chart Data (Dynamic - uses real data from API)
  const userOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#FF6B6B", "#4ECDC4"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: statistics?.monthlyData?.map(item => item.month) || [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: function(val) {
          return val.toLocaleString();
        }
      },
      title: {
        text: "Emails",
        style: {
          fontSize: "12px",
          color: "#6B7280",
        },
      },
    },
  };

  // Use real data for user series, fallback to static data if no API data
  const userSeries = [
    {
      name: "Emails Sent",
      data: statistics?.monthlyData?.map(item => item.emailsSent || 0) || 
            [12500, 14200, 13800, 15600, 18900, 21000, 23400, 25800, 24300, 26700, 28900, 31200],
    },
  ];

  console.log(role, "This is your role");

  const currentSeries = role === "admin" ? adminSeries : userSeries;
  const currentOptions = role === "admin" ? adminOptions : userOptions;

  // Loading state for both admin and user
  if ((isLoading && role === "user") || (adminLoading && role === "admin")) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading statistics...</div>
        </div>
      </div>
    );
  }

  // Error state for both admin and user
  if ((error && role === "user") || (adminError && role === "admin")) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading statistics</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {role === "admin" ? "Current Year Payment Analytics" : "Email Sending Analytics"}
          </p>
        </div>
        
        {/* Admin Stats Summary */}
     
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={currentOptions}
            series={currentSeries}
            type="area"
            height={310}
          />
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
        {currentSeries.map((series, index) => (
          <div key={series.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: currentOptions.colors ? 
                  (Array.isArray(currentOptions.colors) ? currentOptions.colors[index] : '#000') : '#000' 
              }}
            />
            <span className="text-theme-sm text-gray-600 dark:text-gray-400">
              {series.name}
            </span>
          </div>
        ))}
      </div>

      {/* Additional Admin Information */}
 
    </div>
  );
}