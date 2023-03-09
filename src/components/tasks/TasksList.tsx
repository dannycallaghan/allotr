import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Task } from '../../types/types';
import { FiPlusSquare } from 'react-icons/fi';
import TaskItem from './TaskItem';
import { useSession } from 'next-auth/react';
import TaskListControls from './TaskListControls';
import type { ListControls } from '../../pages/[list]';

interface IProps {
  tasks: Task[];
  listId: string;
  listControls: ListControls;
  handleListChange: (data: ListControls) => void;
  total: number;
  listTitle: string;
}

const TasksList = (props: IProps) => {
  const { tasks, listId, listControls, handleListChange, total, listTitle } =
    props;
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
      <div className="mb-6 flex flex-col items-center justify-start sm:flex-row">
        <div className="order-2 flex w-full flex-grow flex-col items-center justify-start text-gray-700 sm:order-1 md:flex-row">
          <p className=" w-full whitespace-nowrap pr-2 pt-2 sm:pt-0 md:w-auto">
            Showing {allTasks.length} of {total} task{total == 1 ? '' : 's'}
          </p>
          <TaskListControls
            listControls={listControls}
            handleValueChange={handleListChange}
          />
        </div>
        <div className="order-1 mt-4 flex w-full sm:order-2 sm:w-auto sm:justify-end md:mt-0">
          <Link
            href={`/${listId}/task?listTitle=${listTitle}`}
            className="btn-primary btn"
          >
            <span className="pr-2 text-lg">
              <FiPlusSquare />
            </span>
            Add new task
          </Link>
        </div>
      </div>
      <div className="pb-6">
        {!!allTasks.length &&
          allTasks.map((task) => (
            <div key={task.id}>
              <TaskItem data={task} remove={handleDelete} claim={handleClaim} />
            </div>
          ))}
        {allTasks.length === 0 && total !== 0 && (
          <p>Oops, you need to change your list filters to see these tasks.</p>
        )}
        {total === 0 && (
          <p>Oh no, this list doesn&apos;t contain any tasks yet.</p>
        )}
      </div>
    </>
  );
};

export default TasksList;
