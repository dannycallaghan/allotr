import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  type: 'link' | 'button' | 'label';
  htmlFor?: string;
  classes: string;
  href?: string;
  match: (string | undefined | null)[];
  onClick?: () => void;
}

const AuthAction = (props: IProps) => {
  const {
    children,
    type,
    classes,
    href = '',
    match,
    onClick,
    htmlFor = '',
  } = props;
  const { data: sessionData } = useSession();

  if (match.includes(sessionData?.user?.id as string)) {
    if (type === 'button') {
      return (
        <button onClick={onClick} className={classes}>
          {children}
        </button>
      );
    }
    if (type === 'label') {
      return (
        <label htmlFor={htmlFor} className={classes}>
          {children}
        </label>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return null;
};

export default AuthAction;
