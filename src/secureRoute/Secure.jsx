'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Secure({children}) {

      const userData = useSession();

    const router = useRouter();


    if(userData.status === 'loading' ){
      return <p>Loading...</p>
    }

    if(userData.status === "unauthenticated"){
      router.push('/signin')
    }
  return (
    <div>

      {children}
    </div>
  )
}
