import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import MainLayout from '../../components/shared/MainLayout';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { ImGoogle3 } from 'react-icons/im';
import Alert from '../../components/shared/Alert';

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { callbackUrl, error } = router.query;
  let errorMessage = '';

  if (error && error.length) {
    switch (error) {
      case 'OAuthCallback':
        errorMessage =
          'We recognise your email address, but not your account. Please sign in with the same provider and account you used originally.';
        break;
      case 'Callback':
        errorMessage =
          "Sorry, there was a problem. If you've signed in to allotr before, please ensure you sign in with the same provider and account you used originally.";
        break;
      default:
        errorMessage =
          'Sorry, there was a problem verifying your details. Please try again later.';
    }
  }

  // @ts-ignore
  const AuthIcon = ({ provider }) => {
    if (provider === 'google') return <ImGoogle3 />;
    if (provider === 'github') return <FaGithub />;
    return <FaFacebook />;
  };

  return (
    <>
      <MainLayout>
        <h1 className="mb-4 text-2xl font-bold">
          Sign in to allotr to continue...
        </h1>
        <div className="mb-44 flex flex-col justify-center gap-4">
          {!!errorMessage.length && <Alert type="error">{errorMessage}</Alert>}
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="btn-outline btn-lg btn w-full gap-2"
                onClick={() =>
                  signIn(provider.id, { callbackUrl: callbackUrl as string })
                }
              >
                <AuthIcon provider={provider.id} />
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </MainLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
