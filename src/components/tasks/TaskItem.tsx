import { useEffect, useState } from 'react';
import type { Task } from '../../types/types';
import { formatAsFriendlyDate } from '../../utils/utils';
import ToggleTaskStatus from './ToggleTaskStatus';
import { HiDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import DeleteTaskButton from './DeleteTaskButton';
import TaskPriority from './TaskPriority';
import { FiCheckSquare } from 'react-icons/fi';
import ClaimTaskButton from './ClaimTaskButton';
import Overdue from './Overdue';

interface IProps {
  data: Task;
  remove: (id: string) => void;
  claim: (id: string) => void;
}

const TaskItem = (props: IProps) => {
  const { data, remove, claim } = props;
  const [completed, setCompleted] = useState<boolean>(data.isComplete);

  const handleToggleStatus = (state: boolean) => {
    setCompleted(state);
  };

  useEffect(() => {
    if (data) {
      setCompleted(data.isComplete);
    }
  }, [data]);

  return (
    <>
      <div
        key={data.id}
        className={`mb-2 rounded-lg border px-4 pt-4 shadow hover:bg-gray-100 ${
          completed ? '' : ''
        }`}
      >
        <div className="flex">
          <Link
            href={`/${data.listId}/${data.id}`}
            className={`flex basis-10/12 items-center hover:underline ${
              completed ? 'text-gray-400 line-through' : ''
            } ${data.title.length > 100 ? 'line-clamp-2' : ''}`}
          >
            <p className="py-0 text-xl">{data.title}</p>
          </Link>
          <div className="flex basis-2/12 items-center justify-end">
            <ToggleTaskStatus
              data={data}
              toggleStatus={handleToggleStatus}
              completed={completed}
            />
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost btn-lg btn">
                <HiDotsVertical />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 border bg-base-100 p-2 shadow"
              >
                <Link
                  href={`/${data.listId}/${data.id}`}
                  type="button"
                  className="btn mb-2"
                >
                  <span className="pr-2 text-lg">
                    <FiCheckSquare />
                  </span>
                  View task
                </Link>
                <ClaimTaskButton data={data} claim={claim} />
                <DeleteTaskButton data={data} remove={remove} />
              </div>
            </div>
          </div>
        </div>
        {(data.priority > 0 || data?.dueDate) && (
          <div className="mb-4 flex rounded-md bg-red-100 p-2 text-sm">
            <div className="flex w-full">
              <div className="flex basis-8/12">
                {data?.dueDate && (
                  <p>
                    {formatAsFriendlyDate(data.dueDate, false, 'Due on ')}
                    <Overdue due={data.dueDate} />
                  </p>
                )}
              </div>
              <div className="flex basis-4/12 justify-center">
                {data.priority > 0 && (
                  <TaskPriority
                    value={data.priority}
                    disabled={true}
                    colors={true}
                    labels={false}
                    id={data.id as string}
                    size="sm"
                    completed={completed}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {data.claimed && data.assignee && (
          <div
            className={`mb-4 flex rounded-md p-2 text-sm ${
              completed ? 'bg-pink-100' : 'bg-pink-100'
            }`}
          >
            <p className="py-0 text-gray-700">
              Task claimed by{' '}
              <span className="font-bold">{data?.assignee?.name}</span>{' '}
            </p>
          </div>
        )}
        {!data.claimed && data.suggestedAssignee && (
          <div
            className={`mb-4 flex rounded-md p-2 text-sm ${
              completed ? 'bg-green-200' : 'bg-green-200'
            }`}
          >
            <p className="py-0 text-gray-700">
              <span className="font-bold">{data?.user?.name}</span> has
              suggested that this is perfect for{' '}
              <span className="font-bold">{data?.suggestedAssignee}</span>{' '}
            </p>
          </div>
        )}
        <div
          className={`mb-4 flex rounded-md p-2 text-sm ${
            completed ? 'bg-gray-200' : 'bg-gray-200'
          }`}
        >
          <p className="py-0 text-gray-700">
            Added by <span className="font-bold">{data?.user?.name}</span>{' '}
            {formatAsFriendlyDate(data?.createdAt, true, 'at ')}
          </p>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
