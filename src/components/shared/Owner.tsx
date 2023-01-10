import type { User } from '../../types/types';
import Image from 'next/image';

interface IProps {
  sub?: string;
  user: User;
}

const Owner = (props: IProps) => {
  const { sub, user } = props;
  return (
    <div className="flex items-center pb-4">
      {user?.image && user.image.length && (
        <Image
          className="w-12 cursor-pointer rounded-full"
          src={user.image}
          alt={user.name as string}
          width={12}
          height={12}
        />
      )}
      <div className="flex flex-col justify-start pl-2">
        {sub && <p className="py-0 text-sm text-gray-400">{sub}:</p>}
        <p className="py-0 leading-6">{user.name}</p>
      </div>
    </div>
  );
};

export default Owner;
