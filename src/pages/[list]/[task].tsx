import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../../components/shared/MainLayout';
import PageSpinner from '../../components/shared/PageSpinner';
import TaskForm from '../../components/tasks/TaskForm';
import { api } from '../../utils/api';

const Task = () => {
  const router = useRouter();
  const routeData = router.query;
  const taskId = routeData.task || '1';
  const listId = routeData.list || '1';
  const { data, isLoading } = api.list.getTaskById.useQuery(
    {
      id: taskId as string,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      {isLoading && (
        <MainLayout>
          <h1 className="text-5xl font-bold">Just one sec...</h1>
          <p className="py-6">Looking in the kitchen drawer for your task.</p>
          <PageSpinner />
        </MainLayout>
      )}
      {!isLoading && !data && (
        <MainLayout>
          <h1 className="text-5xl font-bold">What was that?</h1>
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
        <MainLayout classes="items-start pt-10" hero={false}>
          <TaskForm listId={listId as string} task={data}>
            <h1 className="text-5xl font-bold">Edit task</h1>
          </TaskForm>
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
        destination: `/signin?${callback}`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Task;
