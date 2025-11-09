"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { FaUser } from "react-icons/fa";



const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <FaUser />,
    name: "All Users",
    path: "/users",
  },
  {
    icon: <UserCircleIcon />,
    name: " Profile",
    path: "/profile",
  },
  // {
  //   name: "Form Elements",
  //   icon: <ListIcon />,
  //   path: "/form-elements",
  // }, 
  {
    name: "Payment History",
    icon: <TableIcon />,
    path: "/payment-history",
  },
  // {
  //   name: "Blank Page",
  //   icon: <PageIcon />,
  //   path: "/blank",
  // },
  // {
  //   name: "404 Error",
  //   icon: <PageIcon />,
  //   path: "/error-404",
  // },
];

const othersItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",    path: "/",
  },
  {
    icon: <FaUser />,
    name: "Subscription Details",
    path: "/subscription-details",
  },
  {
    icon: <UserCircleIcon />,
    name: " Profile",
    path: "/profile",
  },
  // {
  //   name: "Form Elements",
  //   icon: <ListIcon />,
  //   path: "/form-elements",
  // }, 
  {
    name: "Payment History",
    icon: <TableIcon />,
    path: "/payment-history",
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (navItems, menuType) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav) => (
        <li key={nav.path}>
          <Link
            href={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
          >
            <span
              className={`${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className={`menu-item-text`}>{nav.name}</span>
            )}
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="flex items-center gap-1 ml-auto">
                {nav.new && (
                  <span
                    className={`ml-auto ${
                      isActive(nav.path)
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    } menu-dropdown-badge `}
                  >
                    new
                  </span>
                )}
                {nav.pro && (
                  <span
                    className={`ml-auto ${
                      isActive(nav.path)
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    } menu-dropdown-badge `}
                  >
                    pro
                  </span>
                )}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  const isActive = useCallback((path) => path === pathname, [pathname]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex items-center  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={60}
                height={60}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                 width={60}
                height={60}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
           width={60}
                height={60}
            />
          )}
        </Link>

        <div className="text-white text-3xl font-semibold">
          Next Goal
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Admin Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "User Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "User Menu")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;