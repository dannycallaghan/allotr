import { useState } from 'react';
import type { Task } from '../../types/types';
import { formatAsFriendlyDate } from '../../utils/utils';
import TaskControls from './TaskControls';
import ToggleTaskStatus from './ToggleTaskStatus';
import { HiDotsVertical } from 'react-icons/hi';

interface IProps {
  data: Task;
  setOpen: (withTask: Task) => void;
  remove: (id: string) => void;
}

const TaskItem = (props: IProps) => {
  const { data, setOpen, remove } = props;
  const [completed, setCompleted] = useState<boolean>(data.isComplete);

  const handleToggleStatus = (state: boolean) => {
    setCompleted(state);
  };

  return (
    <>
      <div
        key={data.id}
        className={`mb-2 rounded-lg p-4 shadow-lg ${
          completed ? 'bg-gray-300' : 'bg-gray-100'
        }`}
      >
        <div className="mb-2 flex">
          <div
            className={`flex basis-8/12 items-center sm:basis-11/12 ${
              completed ? 'line-through' : ''
            } ${data.title.length > 100 ? 'line-clamp-2' : ''}`}
          >
            <p className="py-0">{data.title}</p>
          </div>
          <div className="flex basis-2/12 items-center justify-end sm:basis-1/12">
            <ToggleTaskStatus
              data={data}
              toggleStatus={handleToggleStatus}
              completed={completed}
            />
            <button className="btn-ghost btn text-lg text-primary">
              <HiDotsVertical />
            </button>
          </div>
        </div>
        <div
          className={`flex rounded-md p-2 text-sm ${
            completed ? 'bg-gray-200' : 'bg-gray-200'
          }`}
        >
          <p className="py-0 text-gray-700">
            Added by <span className="text-info">{data.user.name}</span> on{' '}
            {formatAsFriendlyDate(data.createdAt)}
          </p>
        </div>
      </div>

      {/* <p className={`${completed ? 'line-through' : ''}`}>{data.title}</p> */}
      {/* <p>{formatAsFriendlyDate(data.createdAt)}</p>
      <p>{formatAsFriendlyDate(data.updatedAt)}</p> */}

      <TaskControls
        data={data}
        setOpen={() => setOpen(data)}
        remove={() => remove(data.id)}
        // isComplete={handleCompleted}
      />
    </>
  );
};

export default TaskItem;
