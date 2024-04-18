import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../../components/shared/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

const CreateTask: NextPage = () => {
  const router = useRouter();
  const { listTitle, list } = router.query;

  return (
    <MainLayout classes="items-start" hero={false}>
      <TaskForm>
        <>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/" className="text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`/${list}`} className="text-primary">
                  {listTitle}
                </Link>
              </li>
              <li>Add task</li>
            </ul>
          </div>
          <h1 className="overflow-hidden text-ellipsis pb-6 text-4xl font-bold md:text-5xl">
            Add task
          </h1>
        </>
      </TaskForm>
    </MainLayout>
  );
};

export default CreateTask;

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
