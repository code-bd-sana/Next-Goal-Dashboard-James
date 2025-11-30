'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function SecureAdminRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role;

      // যদি role admin না হয়, redirect
      if (role !== 'admin') {
        router.push('/');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // যদি authenticated না হয় বা admin হয়, children দেখাবে
  return <>{children}</>;
}
