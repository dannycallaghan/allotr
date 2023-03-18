import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiShare2 } from 'react-icons/fi';
import MainLayout from '../../components/shared/MainLayout';
import PageSpinner from '../../components/shared/PageSpinner';
import TaskForm from '../../components/tasks/TaskForm';
import { api } from '../../utils/api';
import ModalShareItem from '../../components/modals/ModalShareItem';

const Task = () => {
  const router = useRouter();
  const routeData = router.query;
  const taskId = routeData.task || '1';
  const listId = routeData.list || '1';
  const [path, setPath] = useState<string>('');
  const { data, isLoading } = api.task.getTaskById.useQuery(
    {
      id: taskId as string,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.href);
    }
  }, [setPath]);

  return (
    <>
      {isLoading && (
        <MainLayout>
          <h1 className="text-4xl font-bold md:text-5xl">Just one sec...</h1>
          <p className="py-6">Looking in the kitchen drawer for your task.</p>
          <PageSpinner />
        </MainLayout>
      )}
      {!isLoading && !data && (
        <MainLayout>
          <h1 className="text-4xl font-bold md:text-5xl">What was that?</h1>
          <p className="py-6">
            Sorry, we can&apos;t find any task with that name. Perhaps it&apos;s
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
        <MainLayout classes="items-start" hero={false}>
          <TaskForm listId={listId as string} task={data}>
            <>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <Link href="/" className="text-primary">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${data.listId}`} className="text-primary">
                      {data.list.title}
                    </Link>
                  </li>
                  <li>Edit task</li>
                </ul>
              </div>
              <h1 className="pb-6 text-4xl font-bold md:text-5xl">Edit task</h1>
              <div className="flex flex-wrap gap-2 pb-6">
                <label
                  htmlFor="modal-share-item"
                  className="btn-accent btn-sm btn leading-like-btn-sm"
                >
                  <span className="pr-2 text-lg">
                    <FiShare2 />
                  </span>
                  Share task
                </label>
              </div>
            </>
          </TaskForm>
          <ModalShareItem type="task" path={path} />
        </MainLayout>
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
  const session = await getSession(context);

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

export default Task;
