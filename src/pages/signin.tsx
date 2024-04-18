import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';
import useClientSession from '../hooks/useClientSession';

const Signin = () => {
  const { data: session } = useSession();
  useClientSession(session);

  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    const url = callbackUrl ? (callbackUrl as string) : '';
    signIn(undefined, { callbackUrl: url });
  }, [callbackUrl]);

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold md:text-5xl">Hold on there...</h1>
      <p className="py-6">Checking your papers.</p>
      <PageSpinner />
    </MainLayout>
  );
};

export default Signin;
