import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import MainLayout from '../../components/shared/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';

const CreateTask: NextPage = () => {
  return (
    <MainLayout classes="items-start pt-10" hero={false}>
      <TaskForm>
        <h1 className="overflow-hidden text-ellipsis pb-6 text-5xl font-bold">
          Add task
        </h1>
      </TaskForm>
    </MainLayout>
  );
};

export default CreateTask;

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
  console.log(session);
  return {
    props: { session },
  };
}
