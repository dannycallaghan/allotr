import { useState } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { api } from '../utils/api';
import { useRouter } from 'next/router';
import ModalViewList from '../components/modals/ModalViewList';
import MainLayout from '../components/shared/MainLayout';

interface IFormData {
  title: string;
  description: string;
}

const Home: NextPage = () => {
  const [listId, setListId] = useState<string | null>(null);
  const router = useRouter();
  const { data: sessionData } = useSession();
  // const utils = api.useContext();
  // const createNewList = api.list.createList.useMutation();
  // const [list, setList] = useState<IFormData>({
  //   title: '',
  //   description: '',
  // });
  // const { data } = api.list.getAllLists.useQuery();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   createNewList.mutate({ ...list });
  // };

  // const { data: list, isLoading } = api.list.getListById.useQuery({
  //   id: '63b6f885d80acff9eb00560c',
  // });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (listId) {
      // router.push(`/${listId}`);
      router.push('/63b6f885d80acff9eb00560c');
    }
  };

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
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={list.title}
                onChange={(e) =>
                  setList((prevData: IFormData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={list.description}
                onChange={(e) =>
                  setList((prevData: IFormData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
              />
              <button type="submit">Create</button>
            </form>
          </div>
          <div className="flex flex-col items-center gap-2">
            {!data && <p className="text-2xl text-white">Loading...</p>}
            {data && (
              <p className="text-2xl text-yellow-800">
                {data.map((user) => (
                  <span key={user.id}>
                    <span>{user.name}</span>
                    <br />
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main> */}
    </>
  );
};

export default Home;
