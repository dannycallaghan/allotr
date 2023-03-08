import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';
import DashboardLists from '../components/dashboard/DashboardLists';
import DashboardTasks from '../components/dashboard/DashboardTasks';
import MainLayout from '../components/shared/MainLayout';

const Dashboard: NextPage = () => {
  return (
    <>
      <MainLayout classes="items-start pt-10" hero={false}>
        <h1 className="text-5xl font-bold">Dashboard</h1>
        <p className="py-6">
          Welcome. You can find all of your lists and tasks right here.
        </p>
        <div className="mb-8">
          <DashboardLists />
        </div>
        <div className="mb-8">
          <DashboardTasks />
        </div>
      </MainLayout>
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

export default Dashboard;
