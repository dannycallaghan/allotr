import { useState, useEffect } from 'react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import MainLayout from '../../../components/shared/MainLayout';
import PageSpinner from '../../../components/shared/PageSpinner';
import Alert from '../../../components/shared/Alert';
import type { UpdateListDetailsInput } from '../../../types/types';
import Link from 'next/link';
import { api } from '../../../utils/api';
import ModalListCreated from '../../../components/modals/ModalListCreated';
import { useRouter } from 'next/router';
import { authOptions } from '../../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

const initialListData: () => UpdateListDetailsInput = () => {
  return {
    title: '',
    description: '',
    id: '',
    authorId: '',
  };
};

const EditPage: NextPage = () => {
  const router = useRouter();
  const routeData = router.query;
  const listId = routeData.edit;
  const { data, isLoading } = api.list.getListById.useQuery({
    id: listId as string,
  });
  const [listData, setListData] =
    useState<UpdateListDetailsInput>(initialListData);
  const editMutation = api.list.updateListDetails.useMutation({
    onError: (error: unknown) => {
      console.error('Could not edit list:', error);
    },
    onSuccess: () => router.push(`${host}/${listId}`),
  });
  const [host, setHost] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    editMutation.mutate({ ...listData });
  };

  const handleReset = () => {
    if (data) {
      setListData({
        id: data.id,
        title: data.title,
        description: data.description,
        authorId: data.authorId,
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const port = window.location.port.length
        ? `:${window.location.port}`
        : '';
      setHost(
        `${window.location.protocol}//${window.location.hostname}${port}`,
      );
    }
  }, [setHost]);

  useEffect(() => {
    if (data) {
      setListData({
        id: data.id,
        title: data.title,
        description: data.description,
        authorId: data.authorId,
      });
    }
  }, [data]);

  const handleValidate = () => {
    if (listData) {
      return listData.title.length > 10 && listData.title.length < 256;
    }
    return false;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <h1 className="text-4xl font-bold md:text-5xl">Just one sec...</h1>
        <p className="py-6">Looking in the kitchen drawer for your list.</p>
        <PageSpinner />
      </MainLayout>
    );
  }

  if (!isLoading && !listData) {
    return (
      <MainLayout>
        <h1 className="text-4xl font-bold md:text-5xl">What was that?</h1>
        <p className="py-6">
          Sorry, we can&apos;t find any list with that name. Perhaps it&apos;s
          been thrown in the bin by it&apos;s owner?
        </p>
        <p>
          <Link href="/" className="underline">
            Return home and maybe try again?
          </Link>
        </p>
      </MainLayout>
    );
  }

  if (!isLoading && listData) {
    return (
      <>
        <MainLayout classes="items-start" hero={false}>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/" className="text-primary">
                  Home
                </Link>
              </li>
              <li>Edit your list details</li>
            </ul>
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">
            Edit your list details
          </h1>
          <p className="py-6">Remember that we just need a list title, OK?</p>
          {editMutation.isError && (
            <Alert type="error">
              Well, this is embarrassing. I&apos;m afraid something has gone
              wrong. It&apos;s us, not you. Try again in a minute?
            </Alert>
          )}
          <div className="pb-10 md:rounded-lg md:p-10 md:shadow-lg">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-control w-full pb-6">
                <label className="label" htmlFor="list-title">
                  <span>Change your list title</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. School Summer BBQ"
                  className="input-bordered input w-full"
                  value={listData.title}
                  onChange={(e) =>
                    setListData((prev: UpdateListDetailsInput) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  minLength={10}
                  maxLength={256}
                  id="list-title"
                />
                <label className="label">
                  <span className="label-text-alt">
                    Keep this to between 10 and 256 characters.
                  </span>
                  <span
                    className={`label-text-alt ${
                      listData.title.length < 10 || listData.title.length > 256
                        ? 'text-error'
                        : 'text-success'
                    }`}
                  >
                    {listData.title.length}/256
                  </span>
                </label>
              </div>
              <div className="form-control w-full pb-6">
                <label className="label" htmlFor="list-description">
                  <span>
                    Add or update the description
                    <span className="text-gray-400">(optional)</span>
                  </span>
                </label>
                <textarea
                  placeholder="e.g. We need to allocate jobs for this year's School Summer BBQ, including buying the food, selling the drinks, etc"
                  className="textarea-bordered textarea w-full"
                  value={listData.description}
                  onChange={(e) =>
                    setListData((prev: UpdateListDetailsInput) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  maxLength={1024}
                  id="list-description"
                ></textarea>
                <label className="label">
                  <span className="label-text-alt">
                    No more than 500 characters please.
                  </span>
                  <span
                    className={`label-text-alt ${
                      listData.description.length > 500
                        ? 'text-error'
                        : 'text-success'
                    }`}
                  >
                    {listData.title.length}/500
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <Link href={`/${listData.id}`}>
                  <button type="button" className="btn-ghost btn">
                    Cancel
                  </button>
                </Link>
                <button
                  type="button"
                  className="btn-error btn"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className={`btn-primary btn ${
                    editMutation.isLoading ? 'loading' : ''
                  }`}
                  disabled={!handleValidate()}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </MainLayout>
        {editMutation.isSuccess && (
          <ModalListCreated listId={listId as string} host={host} />
        )}
      </>
    );
  }

  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    let callback = '';
    if (context && context.resolvedUrl) {
      callback = `callbackUrl=${context.resolvedUrl}`;
    }
    return {
      redirect: {
        destination: `/auth/signin?${callback}`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default EditPage;
