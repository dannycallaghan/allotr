import { useEffect, useState } from 'react';
import type { Task } from '../../types/types';
import { FiPlusSquare } from 'react-icons/fi';
import ModalTask from '../modals/ModalTask';
import TaskItem from './TaskItem';
import { compareTime } from '../../utils/utils';
import { useSession } from 'next-auth/react';

interface IProps {
  tasks: Task[];
  listId: string;
}

const TasksList = (props: IProps) => {
  const { tasks, listId } = props;
  const [modalTaskOpen, setModalTaskOpen] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { data: sessionData } = useSession();

  console.log(sessionData);

  const handleCreate = (task: Task) => {
    if (!compareTime(task.createdAt, task.updatedAt)) {
      setAllTasks((prev) => {
        return prev.map((item) => {
          if (item.id === task.id) {
            return task;
          }
          return item;
        });
      });
      return;
    }
    const newTask = {
      ...task,
      user: {
        name: sessionData?.user?.name as string,
        email: '',
        image: '',
        id: '',
        emailVerified: '',
      },
    };
    setAllTasks((prev) => [...prev, newTask]);
  };

  const handleDelete = (id: string) => {
    setAllTasks((prev) => {
      return prev.filter((item) => {
        if (item.id !== id) {
          return item;
        }
      });
    });
  };

  const handleModalTaskOpen = (withTask: Task | null) => {
    if (withTask) {
      setSelectedTask(withTask);
    }
    setModalTaskOpen((prev) => !prev);
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (!modalTaskOpen) {
      timer = setTimeout(() => {
        setSelectedTask(null);
      }, 500);
    }
    () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [modalTaskOpen]);

  return (
    <>
      <div className="mb-6 flex items-center">
        <div className="basis-1/2 text-gray-700">
          Showing {allTasks.length} tasks
        </div>
        <div className="flex w-full justify-end">
          <button
            onClick={() => handleModalTaskOpen(null)}
            className="btn-primary btn"
          >
            <span className="pr-2 text-lg">
              <FiPlusSquare />
            </span>
            Add new task
          </button>
        </div>
      </div>
      <div className="pb-6">
        {allTasks.map((task) => (
          <TaskItem
            key={task.id}
            data={task}
            setOpen={handleModalTaskOpen}
            remove={handleDelete}
          />
        ))}
      </div>
      <ModalTask
        setOpen={() => handleModalTaskOpen(null)}
        isOpen={modalTaskOpen}
        action={handleCreate}
        listId={listId}
        task={selectedTask}
      />
    </>
  );
};

export default TasksList;
