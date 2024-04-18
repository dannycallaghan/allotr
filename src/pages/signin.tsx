import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';
import type { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const Signin = () => {
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: { session },
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

export default Signin;
