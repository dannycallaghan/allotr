import { useState } from 'react';
import type { Task } from '../../types/types';
import { formatAsFriendlyDate } from '../../utils/utils';
import ToggleTaskStatus from './ToggleTaskStatus';
import { HiDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import DeleteTaskButton from './DeleteTaskButton';
import TaskPriority from './TaskPriority';
import { FiCheckSquare } from 'react-icons/fi';
import ClaimTaskButton from './ClaimTaskButton';

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

  return (
    <>
      <div
        key={data.id}
        className={`mb-2 rounded-lg border p-4 shadow hover:bg-gray-100 ${
          completed ? '' : ''
        }`}
      >
        <div className="mb-2">
          {data.priority > 0 && (
            <div>
              <TaskPriority
                value={data.priority}
                disabled={true}
                colors={true}
                labels={false}
                id={data.id as string}
                size="sm"
                completed={completed}
              />
            </div>
          )}
          <div className="flex">
            <Link
              href={`/${data.listId}/${data.id}`}
              className={`flex basis-8/12 items-center hover:underline sm:basis-11/12 ${
                completed ? 'text-gray-400 line-through' : ''
              } ${data.title.length > 100 ? 'line-clamp-2' : ''}`}
            >
              <p className="py-0">{data.title}</p>
            </Link>
            <div className="flex basis-2/12 items-center justify-end sm:basis-1/12">
              <ToggleTaskStatus
                data={data}
                toggleStatus={handleToggleStatus}
                completed={completed}
              />
              <div className="dropdown-end dropdown">
                <label tabIndex={0} className="bt-lg btn-ghost btn">
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
        </div>
        <div
          className={`flex rounded-md p-2 text-sm ${
            completed ? 'bg-gray-200' : 'bg-gray-200'
          }`}
        >
          <p className="py-0 text-gray-700">
            Added by <span className="font-bold">{data?.user?.name}</span>{' '}
            {formatAsFriendlyDate(data?.createdAt, 'at ')}
          </p>
        </div>
        {data.claimed && data.assignee && (
          <div
            className={`mt-4 flex rounded-md p-2 text-sm ${
              completed ? 'bg-pink-100' : 'bg-pink-100'
            }`}
          >
            <p className="py-0 text-gray-700">
              Task has been claimed by{' '}
              <span className="font-bold">{data?.assignee?.name}</span>{' '}
            </p>
          </div>
        )}
        {!data.claimed && data.suggestedAssignee && (
          <div
            className={`mt-4 flex rounded-md p-2 text-sm ${
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
      </div>
    </>
  );
};

export default TaskItem;
