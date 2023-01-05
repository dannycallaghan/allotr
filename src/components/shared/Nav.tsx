import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface IProps {
  sessionData: Session | null;
}

const AuthControls = (props: IProps) => {
  const { sessionData } = props;
  return (
    <button
      className="rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white transition hover:bg-blue-800/20"
      onClick={sessionData ? () => signOut() : () => signIn()}
    >
      {sessionData ? 'Sign out' : 'Sign in'}
    </button>
  );
};

const Profile = (props: IProps) => {
  const {
    sessionData: { user },
  } = props;
  return (
    <>
      <li>
        <Link href="/home">
          <button className="rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white transition hover:bg-blue-800/20">
            Home
          </button>
        </Link>
      </li>
      <li>
        <Link href="/home">
          <>
            {!user?.image && <button>Dashboard</button>}
            {user?.image && (
              <Image
                className="w-12 cursor-pointer rounded-full"
                src={user.image}
                alt={user.name}
                width={12}
                height={12}
              />
            )}
          </>
        </Link>
      </li>
    </>
  );
};

const Nav = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="flex items-center justify-between py-10">
      <Link href="/">
        <button className="text-lg font-medium">allotr</button>
      </Link>
      <ul className="flex items-center gap-5">
        <li>
          <AuthControls sessionData={sessionData} />
        </li>
        {sessionData && <Profile sessionData={sessionData} />}
      </ul>
    </nav>
  );
};

export default Nav;
