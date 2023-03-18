import { useSession } from 'next-auth/react';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Task } from '../../types/types';
import { api } from '../../utils/api';

interface IProps {
  data: Task;
  toggleStatus: (state: boolean) => void;
  completed: boolean;
}

const ToggleTaskStatus = (props: IProps) => {
  const { data, toggleStatus, completed } = props;
  const { data: sessionData } = useSession();

  const editMutation = api.task.updateTask.useMutation({
    onSuccess: () => {
      toast.success('Task updated!');
      toggleStatus(!completed);
    },
    onError: (error) => {
      console.error('Could not edit task:', error);
      toast.error('Well, this is embarrassing.');
    },
  });

  const canToggleStatus = () => {
    return (
      sessionData &&
      (sessionData?.user?.id === data?.user?.id ||
        sessionData?.user?.id === data?.assignee?.id)
    );
  };

  const handleToggleStatus = () => {
    if (!canToggleStatus()) {
      return;
    }
    editMutation.mutate({
      ...data,
      id: data.id as string,
      isComplete: !data.isComplete,
    });
  };

  return (
    <>
      <label
        onClick={handleToggleStatus}
        className={`swap swap-flip ${completed ? 'swap-active' : ''} ${
          canToggleStatus() ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <FaRegCheckSquare
          className={`swap-on h-8 w-8 ${
            canToggleStatus() ? 'fill-current' : 'fill-gray-300'
          }`}
        />
        <FaRegSquare
          className={`swap-off h-8 w-8 ${
            canToggleStatus() ? 'fill-current' : 'fill-gray-300'
          }`}
        />
      </label>
    </>
  );
};

export default ToggleTaskStatus;
