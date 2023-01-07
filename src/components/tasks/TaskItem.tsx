import { useState } from 'react';
import type { Task } from '../../types/types';
import { formatAsFriendlyDate } from '../../utils/utils';
import TaskControls from './TaskControls';
import ToggleTaskStatus from './ToggleTaskStatus';

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
    <div
      key={data.id}
      className={`mb-2 flex rounded-lg p-4 shadow-lg ${
        completed ? 'bg-gray-300' : 'bg-gray-100'
      }`}
    >
      <div
        className={`flex basis-10/12 items-center sm:basis-11/12 ${
          completed ? 'line-through' : ''
        } ${data.title.length > 100 ? 'line-clamp-2' : ''}`}
      >
        <p className="py-0">{data.title}</p>
      </div>
      <div className="flex basis-2/12 items-center justify-end sm:basis-1/12">
        <TaskControls
          data={data}
          setOpen={() => setOpen(data)}
          remove={() => remove(data.id)}
          toggleStatus={handleToggleStatus}
          display={['status']}
          completed={completed}
        />
      </div>

      {/* <p className={`${completed ? 'line-through' : ''}`}>{data.title}</p> */}
      {/* <p>{formatAsFriendlyDate(data.createdAt)}</p>
      <p>{formatAsFriendlyDate(data.updatedAt)}</p> */}

      {/* <TaskControls
        data={data}
        setOpen={() => setOpen(data)}
        remove={() => remove(data.id)}
        isComplete={handleCompleted}
      /> */}
    </div>
  );
};

export default TaskItem;
