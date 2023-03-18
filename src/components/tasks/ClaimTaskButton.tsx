import { useSession } from 'next-auth/react';
import { FiToggleRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { Task } from '../../types/types';
import { api } from '../../utils/api';

interface IProps {
  data: Task;
  claim: (id: string) => void;
}

const ClaimTaskButton = (props: IProps) => {
  const { data, claim } = props;
  const { data: session } = useSession();
  const editMutation = api.task.updateTaskClaimStatus.useMutation({
    onError: (error: unknown) => {
      toast.error('Well, this is embarrassing.');
      console.error('Cound not claim task', error);
    },
    onSuccess: () => {
      toast.success('Task claimed!');
      if (data && data.id) {
        claim(data.id);
      }
    },
  });

  const handleClaim = () => {
    const task = {
      ...data,
      id: data.id as string,
    };
    if (session && session.user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (task.assignee = { ...session.user }), (task.claimed = !task.claimed);
    }
    editMutation.mutate({
      id: task.id,
      claimed: task.claimed,
      authorId: task.authorId as string,
      assigneeId: task.assignee?.id as string,
    });
    return;
  };

  // task is claimed, you are not the assignee and you are not the creator
  if (
    data.claimed &&
    data?.assignee?.id !== session?.user?.id &&
    data?.authorId !== session?.user?.id
  ) {
    // return nothing
    return null;
  }

  // task is claimed, you are not the assignee BUT you are the creator
  if (
    data.claimed &&
    data?.assignee?.id !== session?.user?.id &&
    data?.authorId === session?.user?.id
  ) {
    // return remove claim
    return (
      <>
        <button
          type="button"
          onClick={handleClaim}
          className="btn mb-2 border-pink-100 bg-pink-100 text-black hover:border-pink-200 hover:bg-pink-200"
        >
          <span className="pr-2 text-lg">
            <FiToggleRight />
          </span>
          Remove claim
        </button>
      </>
    );
  }

  // task is claimed, you are not the assignee
  if (data.claimed && data?.assignee?.id === session?.user?.id) {
    // return unclaim
    return (
      <>
        <button
          type="button"
          onClick={handleClaim}
          className="btn mb-2 border-pink-100 bg-pink-100 text-black hover:border-pink-200 hover:bg-pink-200"
        >
          <span className="pr-2 text-lg">
            <FiToggleRight />
          </span>
          Unclaim task
        </button>
      </>
    );
  }

  // task is not claimed

  // return claim task
  return (
    <>
      <button
        type="button"
        onClick={handleClaim}
        className="btn mb-2 border-pink-100 bg-pink-100 text-black hover:border-pink-200 hover:bg-pink-200"
      >
        <span className="pr-2 text-lg">
          <FiToggleRight />
        </span>
        Claim task
      </button>
    </>
  );
};

export default ClaimTaskButton;
