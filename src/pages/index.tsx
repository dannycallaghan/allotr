import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import ModalViewList from '../components/modals/ModalViewList';
import MainLayout from '../components/shared/MainLayout';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>allotr</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <h1 className="text-5xl font-bold">Got things to do?</h1>
        <p className="py-6">
          Create, detail, prioritise, plan and assign your tasks with ease. Then
          share your list with anyone - for free.
        </p>
        <div className="mb-44 flex flex-row justify-center gap-4">
          {sessionData && (
            <Link href="/list/create">
              <button className="btn-primary btn-lg">Create a list</button>
            </Link>
          )}
          {!sessionData && (
            <button
              className="btn-primary btn-lg"
              onClick={() => {
                signIn('google', { callbackUrl: '/create' });
              }}
            >
              Create a list
            </button>
          )}
          <label
            htmlFor="modal-view-list"
            className="btn-primary btn-lg cursor-pointer leading-like-btn-lg"
          >
            View a list
          </label>
        </div>
      </MainLayout>
      <ModalViewList />
    </>
  );
};

export default Home;
