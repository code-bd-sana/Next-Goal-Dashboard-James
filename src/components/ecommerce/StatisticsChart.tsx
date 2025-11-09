"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");

  // Admin Chart Data
  const adminOptions: ApexOptions = {
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
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
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
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const adminSeries = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Revenue",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  // User Chart Data (Email Sending)
  const userOptions: ApexOptions = {
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
      categories: [
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

  const userSeries = [
    {
      name: "Emails Sent",
      data: [12500, 14200, 13800, 15600, 18900, 21000, 23400, 25800, 24300, 26700, 28900, 31200],
    },
   
  ];

  const currentSeries = activeTab === "admin" ? adminSeries : userSeries;
  const currentOptions = activeTab === "admin" ? adminOptions : userOptions;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {activeTab === "admin" ? "Current Year Payment" : "Email Sending Analytics"}
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex bg-gray-100 rounded-lg p-1 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 text-theme-sm font-medium rounded-md transition-all ${
                activeTab === "admin" 
                  ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white" 
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`px-4 py-2 text-theme-sm font-medium rounded-md transition-all ${
                activeTab === "user" 
                  ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white" 
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              User
            </button>
          </div>
        </div>
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
    </div>
  );
}