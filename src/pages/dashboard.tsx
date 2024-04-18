import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import DashboardLists from '../components/dashboard/DashboardLists';
import DashboardTasks from '../components/dashboard/DashboardTasks';
import MainLayout from '../components/shared/MainLayout';
import { useRouter } from 'next/router';
import type { Session } from 'next-auth';

function useClientSession(session: Session | null) {
  const router = useRouter();
  if (!session) {
    const callback = `callbackUrl=${window.location.href}`;
    router.push(`/signin?${callback}`);
  }
}

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  useClientSession(session);

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

export default Dashboard;
