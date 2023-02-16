import { useEffect } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';

const Signin = () => {
  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    const url = callbackUrl ? (callbackUrl as string) : '';
    signIn('google', { callbackUrl: url });
  }, [callbackUrl]);

  return (
    <MainLayout>
      <h1 className="text-5xl font-bold">Hold on there...</h1>
      <p className="py-6">Checking your papers.</p>
      <PageSpinner />
    </MainLayout>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
  const session = await getSession(context);

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
function onEffect(arg0: () => void, arg1: (string | string[])[]) {
  throw new Error('Function not implemented.');
}
