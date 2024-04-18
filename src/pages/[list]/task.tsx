import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../../components/shared/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';
import useClientSession from '../../hooks/useClientSession';

const CreateTask: NextPage = () => {
  const { data: session } = useSession();
  useClientSession(session);

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
