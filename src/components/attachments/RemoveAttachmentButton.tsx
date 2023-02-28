import { useCallback, useEffect, useState } from 'react';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import type { Task } from '../../types/types';
import AuthAction from '../shared/AuthAction';

interface IProps {
  data: Task;
  remove: () => void;
}

const RemoveAttachmentButton = (props: IProps) => {
  const { remove, data } = props;
  const [deleteCount, setDeleteCount] = useState<number>(0);

  const handleRemove = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setDeleteCount((prev) => prev + 1);
  };

  const checkCount = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (count: number) => {
      if (deleteCount === 2) {
        remove();
        setDeleteCount(0);
        return;
      }
    },
    [deleteCount, remove],
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
      match={[data?.assignee?.id, data.authorId]}
      onClick={handleRemove}
      classes={`btn-sm btn ${deleteCount === 0 ? 'btn-error' : 'btn-warning'}`}
    >
      <span className="pr-2 text-lg">
        {deleteCount === 0 ? <FiTrash2 /> : <FiAlertTriangle />}
      </span>
      {deleteCount === 0 ? 'Remove attachment' : 'Sure? Click again'}
    </AuthAction>
  );
};

export default RemoveAttachmentButton;
