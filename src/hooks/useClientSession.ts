import { useRouter } from 'next/router';
import type { Session } from 'next-auth';
import { useEffect } from 'react';

export default function useClientSession(session: Session | null) {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      const callback = `callbackUrl=${window.location.href}`;
      router.push(`/signin?${callback}`);
    }
  });
}