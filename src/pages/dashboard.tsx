import type { NextPage } from 'next';
import { getSession } from 'next-auth/react';

const Dashboard: NextPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
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
