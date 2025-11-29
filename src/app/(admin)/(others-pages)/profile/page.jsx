'use client'

import { useChangePasswordMutation, useGetSingleUserQuery } from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const { data } = useSession();
  const { data: user } = useGetSingleUserQuery(data?.user?.email);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    email:data?.user?.email
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const result = await changePassword(passwordData).unwrap();
      console.log(result, "result is here")
            toast.success("Password change successfully")
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Password change error:", error);
      alert("Failed to change password. Please check your old password.");
    }
  };

  const userData = user?.data;

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4">
      <Toaster/>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      First Name
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.firstName || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Position
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.position || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Graduation Year
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.graduationYear || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      GPA
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.gpa || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Last Name
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.lastName || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Height
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.height || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Weight
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.weight || "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Team
                    </label>
                    <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                      {userData?.team || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Account Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                    {userData?.email || "N/A"}
                  </div>
                </div>
                
           

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Premium Status
                  </label>
                  <div className={`w-full px-4 py-3 rounded-lg border ${
                    userData?.isPremium 
                      ? "bg-purple-900/20 border-purple-600 text-purple-400" 
                      : "bg-gray-700 border-gray-600 text-gray-400"
                  }`}>
                    {userData?.isPremium ? "Premium" : "Standard"}
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Premium Expiry
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                    {userData?.premiumExpireDate 
                      ? new Date(userData.premiumExpireDate).toLocaleDateString()
                      : "N/A"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Change Password */}
          <div className="space-y-8">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                    placeholder="Enter old password"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full px-6 py-3 bg-[#D3AE41] text-black font-semibold rounded-lg hover:bg-[#c19d35] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {isChangingPassword ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>

            {/* Account Details */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Account Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Member Since
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                    {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : "N/A"
                    }
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Last Updated
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white">
                    {userData?.updatedAt 
                      ? new Date(userData.updatedAt).toLocaleDateString()
                      : "N/A"
                    }
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Role
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white capitalize">
                    {userData?.role || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}