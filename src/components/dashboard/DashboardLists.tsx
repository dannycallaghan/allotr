import Link from 'next/link';
import { FiCheckSquare } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';
import type { List } from '../../types/types';
import { api } from '../../utils/api';
import { formatAsFriendlyDate } from '../../utils/utils';
import Alert from '../shared/Alert';
import PageSpinner from '../shared/PageSpinner';

const DashboardLists = () => {
  const {
    data: listsData,
    isLoading: listsIsLoading,
    error,
  } = api.list.getDashboardLists.useQuery();

  if (error) {
    return (
      <Alert type="error">
        Well, this is embarrassing. I&apos;m afraid something has gone wrong.
        It&apos;s us, not you. Try again in a minute?
      </Alert>
    );
  }

  if (listsIsLoading) {
    return (
      <>
        <h1 className="text-2xl font-bold">Your lists</h1>
        <p className="mb-4 text-center">
          Looking to see if you have any lists.
        </p>
        <PageSpinner />
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Your lists</h1>
      {!listsData && (
        <p className="mb-4">
          Oh no! You haven&apos;t created any lists yet! Quick,{' '}
          <Link href="/create" className="text-primary underline">
            create one now!
          </Link>
        </p>
      )}
      {listsData && (
        <>
          <p className="mb-4">
            {`${(listsData as List[]).length === 1 ? 'This is' : 'These are'} `}
            the{' '}
            {`${
              (listsData as List[]).length === 1
                ? 'only'
                : (listsData as List[]).length
            } `}
            list{`${(listsData as List[]).length === 1 ? '' : 's'} `}
            that you have created.{' '}
            {`${(listsData as List[]).length === 1 ? 'So far.' : 'For now.'} `}
          </p>
          {(listsData as List[]).map((list: List) => (
            <div
              key={list.id}
              className="mb-2 rounded-lg border px-4 shadow hover:bg-gray-100"
            >
              <div className="flex">
                <Link
                  href={`/${list.id}`}
                  className="flex basis-10/12 items-center hover:underline"
                >
                  <p className="py-0 text-xl">{list.title}</p>
                </Link>
                <div className="flex basis-2/12 items-center justify-end">
                  <div className="dropdown-end dropdown">
                    <label tabIndex={0} className="btn-ghost btn-lg btn">
                      <HiDotsVertical />
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content menu rounded-box w-52 border bg-base-100 p-2 shadow"
                    >
                      <Link href={`/${list.id}`} type="button" className="btn">
                        <span className="pr-2 text-lg">
                          <FiCheckSquare />
                        </span>
                        View list
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 flex rounded-md bg-gray-200 p-2 text-sm">
                <p className="py-0 text-gray-700">
                  List created at{' '}
                  {formatAsFriendlyDate(list?.createdAt, true, 'at ')}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default DashboardLists;
