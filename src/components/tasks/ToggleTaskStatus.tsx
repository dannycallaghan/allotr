import { useState } from 'react';
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

  const editMutation = api.list.updateTask.useMutation({
    onSuccess: () => {
      toast.success('Task updated!');
      toggleStatus(!completed);
    },
    onError: (error) => {
      console.error('Could not edit task:', error);
      toast.error('Well, this is embarrassing.');
    },
  });

  const handleToggleStatus = () => {
    editMutation.mutate({
      ...data,
      isComplete: !data.isComplete,
    });
  };

  return (
    <>
      <label
        onClick={handleToggleStatus}
        className={`swap swap-flip ${completed ? 'swap-active' : ''}`}
      >
        <FaRegCheckSquare className="swap-on h-8 w-8 fill-current" />
        <FaRegSquare className="swap-off h-8 w-8 fill-current" />
      </label>
    </>
  );
};

export default ToggleTaskStatus;
