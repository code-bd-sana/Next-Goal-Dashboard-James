"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useSession } from "next-auth/react";
import {Hourglass} from 'react-loader-spinner'
import React from "react";

export default function AdminLayout({
  children,
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

     const data = useSession();


    
  

    if(data.status === "loading"){
      return <div className="flex justify-center items-center bg-[#101828] min-h-screen">


        <Hourglass
visible={true}
height="80"
width="80"
ariaLabel="hourglass-loading"
wrapperStyle={{}}
wrapperClass=""
colors={['#162042', '#FFD700']}
/>
      </div>
    }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
