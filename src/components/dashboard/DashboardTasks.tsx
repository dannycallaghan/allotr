import Link from 'next/link';
import { FiCheckSquare } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';
import type { Task } from '../../types/types';
import { api } from '../../utils/api';
import { formatAsFriendlyDate } from '../../utils/utils';
import Alert from '../shared/Alert';
import PageSpinner from '../shared/PageSpinner';
import Overdue from '../tasks/Overdue';
import TaskPriority from '../tasks/TaskPriority';

const DashboardTasks = () => {
  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    error,
  } = api.list.getDashboardTasks.useQuery();

  if (error) {
    return (
      <Alert type="error">
        Well, this is embarrassing. I&apos;m afraid something has gone wrong.
        It&apos;s us, not you. Try again in a minute?
      </Alert>
    );
  }

  if (tasksIsLoading) {
    return (
      <>
        <h1 className="text-2xl font-bold">Your tasks</h1>
        <p className="mb-4 text-center">
          Looking to see if you have claimed any tasks.
        </p>
        <PageSpinner />
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Your tasks</h1>
      <p className="mb-4">
        These can be tasks in your lists, or in lists created by others.
      </p>
      {!tasksData && (
        <p className="mb-4">Oh no! You haven&apos;t claimed any tasks yet!</p>
      )}
      {tasksData && (
        <>
          <p className="mb-4">
            {`${(tasksData as Task[]).length === 1 ? 'This is' : 'These are'} `}
            the{' '}
            {`${
              (tasksData as Task[]).length === 1
                ? 'only'
                : (tasksData as Task[]).length
            } `}
            task{`${(tasksData as Task[]).length === 1 ? '' : 's'} `}
            that you have claimed.{' '}
            {`${(tasksData as Task[]).length === 1 ? 'So far.' : 'For now.'} `}
          </p>
          {(tasksData as Task[]).map((task: Task) => (
            <div
              key={task.id}
              className="mb-2 rounded-lg border px-4 shadow hover:bg-gray-100"
            >
              <div className="flex">
                <Link
                  href={`/${task.listId}/${task.id}`}
                  className="flex basis-10/12 items-center hover:underline"
                >
                  <p className="py-0 text-xl">{task.title}</p>
                </Link>
                <div className="flex basis-2/12 items-center justify-end">
                  <div className="dropdown-end dropdown">
                    <label tabIndex={0} className="btn-ghost btn-lg btn">
                      <HiDotsVertical />
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content menu rounded-box w-52 border bg-base-100 p-2 shadow"
                    >
                      <Link
                        href={`/${task.listId}/${task.id}`}
                        type="button"
                        className="btn"
                      >
                        <span className="pr-2 text-lg">
                          <FiCheckSquare />
                        </span>
                        View task
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {(task.priority > 0 || task?.dueDate) && (
                <div className="mb-4 flex rounded-md bg-red-100 p-2 text-sm">
                  <div className="flex w-full">
                    <div className="flex basis-10/12">
                      {task?.dueDate && (
                        <p>
                          {formatAsFriendlyDate(task.dueDate, false, 'Due on ')}
                          <Overdue due={task.dueDate} />
                        </p>
                      )}
                    </div>
                    <div className="flex basis-2/12 justify-center">
                      {task.priority > 0 && (
                        <TaskPriority
                          value={task.priority}
                          disabled={true}
                          colors={true}
                          labels={false}
                          id={task.id as string}
                          size="sm"
                          completed={task.isComplete}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-4 flex rounded-md bg-gray-200 p-2 text-sm">
                <p className="py-0 text-gray-700">
                  Task created at{' '}
                  {formatAsFriendlyDate(task?.createdAt, true, 'at ')}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default DashboardTasks;
