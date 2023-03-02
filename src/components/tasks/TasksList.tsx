import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Task } from '../../types/types';
import { FiPlusSquare } from 'react-icons/fi';
import TaskItem from './TaskItem';
import { useSession } from 'next-auth/react';
import TaskListControls from './TaskListControls';
import { ListControls } from '../../pages/[list]';

interface IProps {
  tasks: Task[];
  listId: string;
  listControls: ListControls;
  handleListChange: (data: ListControls) => void;
  total: number;
}

const TasksList = (props: IProps) => {
  const { tasks, listId, listControls, handleListChange, total } = props;
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);
  const { data: session } = useSession();

  const handleDelete = (id: string) => {
    setAllTasks((prev) => {
      return prev.filter((item) => {
        if (item.id !== id) {
          return item;
        }
      });
    });
  };

  const handleClaim = (id: string) => {
    setAllTasks((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const data = { ...item };
          if (session && session.user) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (data.assignee = { ...session.user }),
              (data.claimed = !data.claimed);
          }
          console.log(data);
          return data;
        }
        return item;
      });
    });
  };

  useEffect(() => {
    setAllTasks(tasks);
  }, [tasks]);

  return (
    <>
      <div className="mb-6 flex items-center">
        <div className="flex flex-grow items-center text-gray-700">
          <p>
            Showing {allTasks.length} of {total} task{total == 1 ? '' : 's'}
          </p>
          <TaskListControls
            listControls={listControls}
            handleValueChange={handleListChange}
          />
        </div>
        <div className="flex justify-end">
          <Link href={`/${listId}/task`} className="btn-primary btn">
            <span className="pr-2 text-lg">
              <FiPlusSquare />
            </span>
            Add new task
          </Link>
        </div>
      </div>
      <div className="pb-6">
        {allTasks.map((task) => (
          <>
            <TaskItem
              key={task.id}
              data={task}
              remove={handleDelete}
              claim={handleClaim}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default TasksList;
