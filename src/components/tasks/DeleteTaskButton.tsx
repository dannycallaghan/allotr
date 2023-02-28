import { useCallback, useEffect, useState } from 'react';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { Task } from '../../types/types';
import { api } from '../../utils/api';
import AuthAction from '../shared/AuthAction';

interface IProps {
  data: Task;
  remove: (id: string) => void;
}

const DeleteTaskButton = (props: IProps) => {
  const { remove, data } = props;
  const [deleteCount, setDeleteCount] = useState<number>(0);
  const deleteMutation = api.list.deleteTask.useMutation({
    onError: (error: unknown) => {
      toast.error('Well, this is embarrassing.');
      console.error('Cound not delete task', error);
    },
    onSuccess: () => {
      toast.success('Task forgotten successfully!');
      if (data && data.id) {
        remove(data.id);
      }
    },
  });

  const handleRemove = () => {
    setDeleteCount((prev) => prev + 1);
  };

  const checkCount = useCallback(
    (count: number) => {
      console.log(`count is now ${count}`);
      if (deleteCount === 2 && data && data.id) {
        deleteMutation.mutate({ id: data.id });
        setDeleteCount(0);
        return;
      }
    },
    [deleteCount, deleteMutation, data.id],
  );

  useEffect(() => {
    if (deleteCount) {
      checkCount(deleteCount);
    }
  }, [deleteCount, checkCount]);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (deleteCount !== 0) {
      timer = setTimeout(() => {
        setDeleteCount(0);
      }, 3000);
    }
    () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [deleteCount]);

  return (
    <AuthAction
      type="button"
      href={`/${data.listId}/${data.id}`}
      match={[data?.assignee?.id, data?.authorId]}
      onClick={handleRemove}
      classes={`btn-sm btn ${deleteCount === 0 ? 'btn-error' : 'btn-warning'}`}
    >
      <span className="pr-2 text-lg">
        {deleteCount === 0 ? <FiTrash2 /> : <FiAlertTriangle />}
      </span>
      {deleteCount === 0 ? 'Delete task' : 'Sure? Click again'}
    </AuthAction>
  );
};

export default DeleteTaskButton;
