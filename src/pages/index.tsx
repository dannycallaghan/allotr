import { useState } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { api } from '../utils/api';
import { useRouter } from 'next/router';
import ModalViewList from '../components/modals/ModalViewList';

interface IFormData {
  title: string;
  description: string;
}

const Home: NextPage = () => {
  const [listId, setListId] = useState<string | null>(null);
  const router = useRouter();
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
      <main className="text-lg font-medium">
        <div className="hero">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Got things to do?</h1>
              <p className="py-6">
                Create, detail, prioritise, plan and assign your tasks with
                ease. Then share your list with anyone - for free.
              </p>
              {/* {isLoading && <p>Loading</p>} */}
              {/* {list && <pre>{JSON.stringify(list, null, 2)}</pre>} */}
              <div className="mb-44 flex flex-row justify-center gap-4">
                <button className="btn-primary btn-lg">Create a list</button>
                <label
                  htmlFor="modal-view-list"
                  className="btn-primary btn-lg cursor-pointer leading-like-btn-lg"
                >
                  View a list
                </label>
              </div>
            </div>
          </div>
        </div>
        <ModalViewList />

        {/* <ul className="flex flex-col justify-center">
          <li className="flex justify-center py-8">
            <Link href="/create" className="w-full">
              <button className="w-full rounded-lg bg-cyan-500 py-8 px-24 text-2xl font-medium text-white transition hover:bg-blue-800/20">
                Create List
              </button>
            </Link>
          </li>
          <li className="flex justify-center py-8">
            <div className="w-full rounded-lg bg-cyan-500 py-8 px-24 text-2xl font-medium text-white">
              <span className="block w-full text-center">View List</span>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter unique list ID"
                  onChange={(e) => setListId(e.target.value.trim())}
                  className="my-6 w-full bg-gray-800 p-4 text-center text-white"
                  // minLength={24}
                  maxLength={24}
                />
                <button
                  type="submit"
                  // disabled={!listId || listId.length < 24}
                  disabled={!listId || !listId.length}
                  className="w-full bg-gray-500 py-2 px-4 text-white disabled:opacity-25"
                >
                  Go
                </button>
              </form>
            </div>
          </li>
        </ul> */}
      </main>
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
