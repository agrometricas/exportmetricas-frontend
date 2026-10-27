'use client';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

export default function IsOnboarding<P extends object>(
  Component: React.ComponentType<P>
): (props: P) => React.JSX.Element | null {
  return function IsMerchantId(props: P): React.JSX.Element | null {
    const { data: session, status } = useSession();

    const isOnboarded = session?.user?.onboardingStatus;

    useEffect(() => {
      if (isOnboarded === 'pending' && status === 'authenticated') {
        return redirect('/dashboard/onboarding');
      }
    }, [isOnboarded, status]);

    if (!isOnboarded) {
      return null;
    }

    return <Component {...props} />;
  };
}
