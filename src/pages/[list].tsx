/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';
import ListControls from '../components/lists/ListControls';
import { api } from '../utils/api';
import Owner from '../components/shared/Owner';
import { formatAsFriendlyDate, localStorageDB } from '../utils/utils';
import Copy from '../components/shared/Copy';
import TasksList from '../components/tasks/TasksList';
import type { Task } from '../types/types';
import { useSession } from 'next-auth/react';
import { add, isAfter, isBefore } from 'date-fns';

export interface ListControls {
  open: boolean;
  my: boolean;
  unclaimed: boolean;
  by: string;
}

const List = () => {
  const router = useRouter();
  const routeData = router.query;
  const { data: session } = useSession();
  const listId = routeData.list || '1';
  const { data, isLoading } = api.list.getListById.useQuery({
    id: listId as string,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [lastUpdated, setLastUpdated] = useState<null | Date>(null);

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem(localStorageDB)) {
      try {
        const controls = JSON.parse(
          window.localStorage.getItem(localStorageDB) as string,
        );
        setListControls(controls);
      } catch (e) {}
    }
  }, []);

  const [listControls, setListControls] = useState<ListControls>({
    open: false,
    my: false,
    unclaimed: false,
    by: 'createdAtNewest',
  });

  const handleListChange = (data: ListControls) => {
    setListControls((prev) => {
      const newControls = {
        ...prev,
        ...data,
      };
      if (window.localStorage) {
        window.localStorage.setItem(
          localStorageDB,
          JSON.stringify(newControls),
        );
      }
      return newControls;
    });
  };

  const filterAndOrderList = async (unfiltered: Task[]) => {
    let filtered = unfiltered;

    if (!lastUpdated) {
      setLastUpdated(unfiltered[0]?.updatedAt as Date);
    }

    if (listControls.my) {
      filtered = filtered.filter((task) => {
        return task.claimed && task?.assignee?.id === session?.user?.id;
      });
    }

    if (listControls.open) {
      filtered = filtered.filter((task) => !task.isComplete);
    }

    if (listControls.unclaimed) {
      filtered = filtered.filter((task) => !task.claimed);
    }

    switch (listControls.by) {
      case 'createdAtOldest':
        filtered = filtered.sort((a, b) =>
          isBefore(b.createdAt as Date, a.createdAt as Date) ? 1 : -1,
        );
        break;
      case 'priority':
        filtered = filtered.sort((a, b) => (b.priority > a.priority ? 1 : -1));
        break;
      case 'dueDate':
        filtered = filtered.sort((a, b) => {
          const aDate = a.dueDate
            ? (a.dueDate as Date)
            : add(data?.createdAt as Date, { years: 100 });
          const bDate = b.dueDate
            ? (b.dueDate as Date)
            : add(data?.createdAt as Date, { years: 100 });

          return isAfter(aDate, bDate) ? 1 : -1;
        });
        break;
      default: // createdAtOldest
        filtered = filtered.sort((a, b) =>
          isBefore(a.createdAt as Date, b.createdAt as Date) ? 1 : -1,
        );
    }

    setTasks(filtered);
    forceUpdate();
  };

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      setCurrentPath(window.location.href);
      filterAndOrderList(data.tasks);
    }
  }, [data, setCurrentPath]);

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      filterAndOrderList(data.tasks);
    }
  }, [listControls]);

  return (
    <>
      {isLoading && (
        <MainLayout>
          <h1 className="text-5xl font-bold">Just one sec...</h1>
          <p className="py-6">Looking in the kitchen drawer for your list.</p>
          <PageSpinner />
        </MainLayout>
      )}
      {!isLoading && !data && (
        <MainLayout>
          <h1 className="text-5xl font-bold">What was that?</h1>
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
      )}
      {!isLoading && data && (
        <MainLayout classes="items-start pt-10" hero={false}>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/" className="text-primary">
                  Home
                </Link>
              </li>
              <li>{data.title}</li>
            </ul>
          </div>
          <h1 className="overflow-hidden text-ellipsis pb-6 text-5xl font-bold">
            {data.title}
          </h1>
          <ListControls
            listId={data.id}
            listOwner={data?.user?.id}
            path={currentPath}
          />
          <div className="mb-6 rounded-lg p-10 shadow-lg">
            <div
              className={`flex flex-row flex-wrap ${
                !!data.description.length ? 'pb-6' : ''
              }`}
            >
              <div className="order-1 flex w-full flex-col md:order-1 md:basis-3/5">
                <Owner sub="List owner" user={data.user} />
              </div>
              <div className="placeholder: order-3 flex w-full flex-col md:order-2 md:basis-2/5">
                <p className="text-sm text-gray-400">Created:</p>
                <p className="flex pb-2 text-sm">
                  {formatAsFriendlyDate(data.createdAt, true)}
                </p>
              </div>
              <div className="order-2 flex w-full flex-col overflow-hidden text-ellipsis md:order-3 md:basis-3/5">
                <p className="text-sm text-gray-400">List shareable link:</p>
                <p className="flex pb-2 pr-2 text-sm">
                  <span className="block overflow-hidden text-ellipsis">
                    {currentPath}
                  </span>
                  <Copy path={currentPath} />
                </p>
              </div>
              <div className="order-4 flex w-full flex-col  md:order-4 md:basis-2/5">
                <p className="text-sm text-gray-400">Last updated:</p>
                <p className="flex pb-2 text-sm">
                  {formatAsFriendlyDate(
                    lastUpdated ? lastUpdated : data.updatedAt,
                    true,
                  )}
                </p>
              </div>
            </div>
            {!!data.description.length && (
              <p className="rounded-md bg-base-200 p-4">{data.description}</p>
            )}
          </div>
          <TasksList
            listId={data.id}
            listTitle={data.title}
            tasks={tasks}
            listControls={listControls}
            handleListChange={handleListChange}
            total={data.tasks.length}
          />
        </MainLayout>
      )}
    </>
  );
};

export default List;
