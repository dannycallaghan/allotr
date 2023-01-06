import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import MainLayout from '../../components/shared/MainLayout';
import Alert from '../../components/shared/Alert';
import type { CreatePostInput } from '../../types/types';
import Link from 'next/link';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import ModalListLink from '../../components/modals/ModalListLink';

const initialListData: () => CreatePostInput = () => {
  return {
    title: '',
    description: '',
  };
};

const CreatePage: NextPage = () => {
  const [listData, setListData] = useState<CreatePostInput>(initialListData);
  const [listId, setlistId] = useState<string>('');
  const createMutation = api.list.createList.useMutation({
    onSuccess: (data) => {
      const id = data?.id || '';
      setlistId(id);
    },
    onError: (error) => {
      console.error('Could not create list:', error);
    },
  });
  const [host, setHost] = useState<string>('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...listData });
  };

  const handleReset = () => {
    setListData(initialListData);
  };

  const handleValidate = () => {
    return listData.title.length > 10 && listData.title.length < 256;
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

  return (
    <>
      <MainLayout classes="items-start pt-10" hero={false}>
        <h1 className="text-5xl font-bold">Create Your List</h1>
        <p className="py-6">
          OK, so what do you need to do? Remember, only a list title and a first
          task are required - it&apos;s that easy.
        </p>
        {createMutation.isError && (
          <Alert type="error">
            Well, this embarrassing. I&apos;m afraid something has gone wrong.
            It&apos;s us, not you. Try again in a minute?
          </Alert>
        )}
        <div className="rounded-lg p-10 shadow-lg">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-control w-full pb-6">
              <label className="label" htmlFor="list-title">
                <span>Give your list a title</span>
              </label>
              <input
                type="text"
                placeholder="e.g. School Summer BBQ"
                className="input-bordered input w-full"
                value={listData.title}
                onChange={(e) =>
                  setListData((prev) => ({ ...prev, title: e.target.value }))
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
                  Describe what your list is for{' '}
                  <span className="text-gray-400">(optional)</span>
                </span>
              </label>
              <textarea
                placeholder="e.g. We need to allocate jobs for this year's School Summer BBQ, including buying the food, selling the drinks, etc"
                className="textarea-bordered textarea w-full"
                value={listData.description}
                onChange={(e) =>
                  setListData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                maxLength={1024}
                id="list-description"
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  No more than 1024 characters please.
                </span>
                <span
                  className={`label-text-alt ${
                    listData.description.length > 1024
                      ? 'text-error'
                      : 'text-success'
                  }`}
                >
                  {listData.title.length}/256
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <Link href="/">
                <button className="btn-ghost btn">Cancel</button>
              </Link>
              <button className="btn" onClick={handleReset}>
                Reset
              </button>
              <button
                className={`btn-primary btn ${
                  createMutation.isLoading ? 'loading' : ''
                }`}
                disabled={!handleValidate()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </MainLayout>
      {createMutation.isSuccess && (
        <ModalListLink listId={listId} host={host} />
      )}
    </>
  );
};

export default CreatePage;
