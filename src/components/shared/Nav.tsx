import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { GoTriangleDown } from 'react-icons/go';
import { FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';

interface IProps {
  sessionData: Session | null;
}

const AuthControls = (props: IProps) => {
  const { sessionData } = props;
  const router = useRouter();

  return (
    <button
      className="rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white transition hover:bg-primary"
      onClick={
        sessionData
          ? () => signOut()
          : () => signIn(undefined, { callbackUrl: router.asPath })
      }
    >
      {sessionData ? 'Sign out' : 'Sign in'}
    </button>
  );
};

const Profile = (props: IProps) => {
  const { sessionData } = props;

  const UserInitials = ({ name }) => {
    const splits = name.split(' ');
    let initials = splits[0].charAt(0);
    if (splits.length > 1) {
      initials = `${splits[0].charAt(0)}${splits[1].charAt(0)}`;
    }
    return initials;
  };

  return (
    <div className="dropdown-end dropdown">
      <button tabIndex={0} className="btn-lg px-0">
        <span className="flex items-center">
          <span className="pr-2 text-2xl text-white sm:text-black">
            <GoTriangleDown />
          </span>
          {!sessionData?.user?.image && (
            <span className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black text-white">
              {sessionData?.user?.name ? (
                <UserInitials name={sessionData.user.name} />
              ) : (
                <FiUser />
              )}
            </span>
          )}
          {sessionData?.user?.image && (
            <Image
              className="w-12 cursor-pointer rounded-full"
              src={sessionData.user.image}
              alt={sessionData.user.name as string}
              width={12}
              height={12}
            />
          )}
        </span>
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content rounded-box w-52 bg-base-content p-2 text-white shadow sm:bg-base-100 sm:text-black"
      >
        <li className="mb-2">
          <div>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              Signed in as:
              <br />
              <span className="font-bold">
                {sessionData?.user?.name || sessionData?.user?.email}
              </span>
            </p>
          </div>
        </li>
        <li className="mb-2 justify-center">
          <Link
            className="flex w-full justify-center rounded-lg bg-primary py-2 px-4 text-sm font-medium text-white transition hover:bg-primary"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </li>
        <li className="justify-center">
          <button
            className="flex w-full justify-center rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white transition hover:bg-primary"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
};

const Nav = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="container navbar mx-auto bg-base-content sm:bg-base-100 md:px-16">
      <div className="flex-1">
        <Link
          className="btn-ghost btn px-0 text-2xl normal-case text-white sm:text-black"
          href="/"
        >
          allotr
        </Link>
      </div>
      <div className="flex-none">
        {sessionData ? (
          <Profile sessionData={sessionData} />
        ) : (
          <AuthControls sessionData={sessionData} />
        )}
      </div>
    </div>
  );
};

export default Nav;
