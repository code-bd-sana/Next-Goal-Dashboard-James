'use client'
import { useGetSingleUserQuery } from '@/feature/UserApi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function SecureProvider({children}) {
    const { data } = useSession();
    const userData = useSession();

  
  const { data: user, isLoading } = useGetSingleUserQuery(data?.user?.email);

  const router = useRouter();

    if(userData.status === 'loading' || isLoading){
      return <p>Loading...</p>
    }

    if(userData.status === "unauthenticated"){
      router.push('/signin')
    }




  console.log(user?.data?.isPremium, "TUi to user re vudai")

  if (!user?.data?.isPremium) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="bg-[#1e293b] rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-700">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            
            {/* Message */}
            <h2 className="text-xl font-bold text-white mb-2">
              Subscription Required
            </h2>
            <p className="text-gray-300 mb-6">
              You need a subscription to access this page
            </p>

            {/* Buttons */}
            <div className="flex flex-col space-y-3">
              <Link 
                href="/subscription-details/upgrade-plan"
                className="w-full px-6 py-3 bg-[#D3AE41] text-black font-semibold rounded-lg hover:bg-[#c19d35] transition-all transform hover:scale-105 text-center"
              >
                Upgrade Now
              </Link>
              
              <Link 
                href="/"
                className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      
      {children}
    </div>
  )
}
