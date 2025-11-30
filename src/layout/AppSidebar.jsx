"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  HorizontaLDots,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { FaUser, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { GiTeacher } from "react-icons/gi";
import { IoSendSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";

// NAVIGATION ITEMS
const navItems = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <FaUser />, name: "All Users", path: "/users" },
  { icon: <GiTeacher />, name: "Coach", path: "/coach" },
  { icon: <UserCircleIcon />, name: "Profile", path: "/profile" },
  { icon: <TableIcon />, name: "Payment History", path: "/payment-history" },
];

const othersItems = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <MdOutlineMailOutline />, name: "Create Email", path: "/create-email" },
  { icon: <HiTemplate />, name: "Email Template", path: "/template" },
  { icon: <GiTeacher />, name: "Select Coach", path: "/select-coaches" },
  { icon: <IoSendSharp />, name: "Send Email", path: "/send-email" },
  { icon: <FaUser />, name: "Subscription Details", path: "/subscription-details" },
  { icon: <UserCircleIcon />, name: "Profile", path: "/profile" },
  { icon: <TableIcon />, name: "Payment History", path: "/payment-history" },
];

// SOCIAL LINKS
const socialLinks = [
  { icon: <FaFacebook className="w-4 h-4" />, name: "Facebook", url: "https://www.facebook.com/" },
  { icon: <FaTwitter className="w-4 h-4" />, name: "X (Twitter)", url: "https://x.com/" },
  { icon: <FaLinkedin className="w-4 h-4" />, name: "LinkedIn", url: "https://www.linkedin.com/" },
  { icon: <FaInstagram className="w-4 h-4" />, name: "Instagram", url: "https://www.instagram.com/" },
];

// MEMOIZED MENU LIST
const MenuList = React.memo(({ items, isExpanded, isMobileOpen, pathname }) => {
  const isActive = useCallback((path) => path === pathname, [pathname]);

  return (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.path}>
          <Link
            href={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            } ${!isExpanded ? "lg:justify-center" : "lg:justify-start"}`}
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

            {(isExpanded || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
});

const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const { data } = useSession();
  const role = data?.user?.role;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* LOGO */}
   <div
        className={`py-8 justify-center mx-auto flex items-center  
         "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
      
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo3.png"
                alt="Logo"
                width={160}
                height={160}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo3.png"
                alt="Logo"
                width={160}
                height={160}
              />
            </>
          
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          {role === "admin" && (
            <div>
              <h2 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400">
                Admin Menu
              </h2>
              <MenuList
                items={navItems}
                isExpanded={isExpanded}
                isMobileOpen={isMobileOpen}
                pathname={pathname}
              />
            </div>
          )}

          {role === "user" && (
            <div>
              <MenuList
                items={othersItems}
                isExpanded={isExpanded}
                isMobileOpen={isMobileOpen}
                pathname={pathname}
              />
            </div>
          )}
        </nav>

        {/* SidebarWidget only when expanded */}
        {isExpanded && <SidebarWidget />}

        {/* Social Links */}
        <div className="mt-auto pb-6">
          {isExpanded && (
            <h3 className="text-xs uppercase text-gray-400 mb-3 font-medium">
              Follow Us
            </h3>
          )}
          <div
            className={`flex ${isExpanded ? "justify-between" : "justify-center"} gap-2`}
          >
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
