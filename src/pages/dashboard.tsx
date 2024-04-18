import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import DashboardLists from '../components/dashboard/DashboardLists';
import DashboardTasks from '../components/dashboard/DashboardTasks';
import MainLayout from '../components/shared/MainLayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

const Dashboard: NextPage = () => {
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
            <li>Dashboard</li>
          </ul>
        </div>
        <h1 className="text-4xl font-bold md:text-5xl">Dashboard</h1>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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
