import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Task } from '../../types/types';
import { FiPlusSquare } from 'react-icons/fi';
import TaskItem from './TaskItem';

interface IProps {
  tasks: Task[];
  listId: string;
}

const TasksList = (props: IProps) => {
  const { tasks, listId } = props;
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);

  const handleDelete = (id: string) => {
    setAllTasks((prev) => {
      return prev.filter((item) => {
        if (item.id !== id) {
          return item;
        }
      });
    });
  };

  useEffect(() => {
    setAllTasks(tasks);
  }, [tasks]);

  return (
    <>
      <div className="mb-6 flex items-center">
        <div className="basis-1/2 text-gray-700">
          Showing {allTasks.length} tasks
        </div>
        <div className="flex w-full justify-end">
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
          <TaskItem key={task.id} data={task} remove={handleDelete} />
        ))}
      </div>
    </>
  );
};

export default TasksList;
