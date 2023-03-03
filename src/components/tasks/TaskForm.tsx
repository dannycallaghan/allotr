/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Task } from '../../types/types';
import { api } from '../../utils/api';
import Alert from '../shared/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';
import { useRouter } from 'next/router';
import Attachments from '../attachments/Attachments';
import { useSession } from 'next-auth/react';
import TaskPriority from './TaskPriority';

interface IProps {
  task?: Task | null;
  children: React.ReactNode;
}

const TaskForm = (props: IProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const routeData = router.query;
  const listId = routeData.list || '1';
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { task, children } = props;
  const initialTaskData: () => Task = () => {
    return {
      title: '',
      isComplete: false,
      listId: listId as string,
      dueDate: null,
      description: '',
      comment: '',
      attachments: '',
      suggestedAssignee: '',
      claimed: false,
      priority: 0,
    };
  };
  const [taskData, setTaskData] = useState<Task>(initialTaskData);

  const createMutation = api.list.createTask.useMutation({
    onSuccess: () => {
      router.push(`/${listId}`);
      toast.success('New task added!');
    },
    onError: (error) => {
      console.error('Could not create task:', error);
    },
  });

  const editMutation = api.list.updateTask.useMutation({
    onSuccess: () => {
      router.push(`/${listId}`);
      toast.success('Task updated!');
    },
    onError: (error) => {
      console.error('Could not edit task:', error);
    },
  });

  const handleReset = () => {
    setTaskData(initialTaskData);
  };

  const handleQuit = () => {
    router.push(`/${listId}`);
  };

  const handleUpdateAttachments = (attachments: string) => {
    setTaskData((prev) => ({
      ...prev,
      attachments,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (task) {
      editMutation.mutate({
        ...taskData,
        id: task.id as string,
      });
      return;
    }
    createMutation.mutate({
      ...taskData,
    });
  };

  const handleValidate = () => {
    return taskData.title.length >= 6 && taskData.title.length <= 256;
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="form-control w-full pb-6">
        <label className="label" htmlFor="task-due-date">
          <span>
            Does it have a due date?{' '}
            <span className="label-text-alt">(optional)</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="Click to select date"
          className="input-bordered input w-full"
          defaultValue={value}
          onClick={onClick}
          ref={ref}
          id="task-due-date"
          disabled={!canAlterTask()}
        />
      </div>
    );
  });

  const handleClaimTask = (persist = false) => {
    if (persist && task) {
      editMutation.mutate({
        ...taskData,
        id: task.id as string,
        claimed: false,
      });
      return;
    }
    setTaskData((prev) => {
      const data = { ...prev };
      if (session && session.user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (data.assignee = { ...session.user }), (data.claimed = !data.claimed);
      }
      return data;
    });
  };

  const handleUpdatePriority = (value: number) => {
    console.log(`Change priority to ${value}`);
    setTaskData((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const canAlterTask = () => {
    if (mode !== 'edit') return true;
    return (
      mode == 'edit' &&
      ((taskData.claimed && taskData?.assignee?.id === session?.user?.id) ||
        taskData?.user?.id === session?.user?.id)
    );
    return false;
  };

  const isCreator = () => taskData?.user?.id === session?.user?.id;

  const isClaimant = () =>
    taskData.claimed && taskData?.assignee?.id === session?.user?.id;

  useEffect(() => {
    if (task) {
      setTaskData(() => ({
        title: task.title,
        isComplete: task.isComplete,
        listId: task.listId,
        dueDate: task.dueDate,
        description: task.description,
        comment: task.comment,
        attachments: task.attachments,
        suggestedAssignee: task.suggestedAssignee,
        claimed: task.claimed,
        assignee: task.assignee,
        user: task.user,
        priority: task.priority,
      }));
      setMode('edit');
    }
  }, [task]);

  return (
    <>
      {children}
      {mode === 'create' ? (
        <p className="py-4">Got a new task, huh? All we need is a title.</p>
      ) : (
        <>
          {taskData.claimed && canAlterTask() && (
            <div className="mb-2 mt-4 rounded-lg bg-pink-100 px-4 pt-2">
              <div className="form-control w-full pb-2">
                <div className="form-control">
                  <label
                    className="label cursor-pointer justify-start"
                    htmlFor="task-claimed"
                  >
                    {isClaimant() && (
                      <>
                        <span className="pr-4">
                          Not for you anymore? Unclaim this task
                        </span>
                        <input
                          type="checkbox"
                          className="toggle-success toggle"
                          checked={taskData.claimed}
                          id="task-claimed"
                          onChange={() => handleClaimTask(true)}
                        />
                      </>
                    )}
                    {isCreator() && !isClaimant() && (
                      <>
                        <span className="pr-4">
                          This task is currently claimed by{' '}
                          <span className="font-bold">
                            {taskData?.assignee?.name} (
                            {taskData?.assignee?.email})
                          </span>
                          {'. '}
                          As the task creator, you can remove this claim by
                          moving the toggle switch to the{' '}
                          <span className="italic">off</span> position.
                        </span>
                        <input
                          type="checkbox"
                          className="toggle-success toggle"
                          checked={taskData.claimed}
                          id="task-claimed"
                          onChange={() => handleClaimTask(true)}
                        />
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}
          {!taskData.claimed && (
            <div className="mb-2 mt-4 rounded-lg bg-pink-100 px-4 pt-2">
              <div className="form-control w-full pb-2">
                <div className="form-control">
                  {!isCreator() && (
                    <p className="label">
                      If you want to do more than just view this task, you must
                      first claim it as your own.
                    </p>
                  )}
                  <label
                    className="label cursor-pointer justify-start"
                    htmlFor="task-claimed"
                  >
                    <span className="pr-4">
                      Think this is perfect for you? Claim this task{' '}
                    </span>
                    <input
                      type="checkbox"
                      className="toggle-success toggle"
                      checked={taskData.claimed}
                      id="task-claimed"
                      onChange={() => handleClaimTask()}
                    />
                  </label>
                  {!isCreator() && (
                    <p className="label-text-alt label">
                      Once you claim this task, only you or the creator of this
                      task will be able to take it away from you.
                    </p>
                  )}
                </div>
              </div>
              {isCreator() && (
                <div className="form-control w-full pb-2">
                  <label className="label" htmlFor="task-suggested">
                    <span>Or maybe assign this task to someone else?</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Smith"
                    className="input-bordered input w-full"
                    value={taskData.suggestedAssignee}
                    disabled={taskData.claimed}
                    onChange={(e) =>
                      setTaskData((prev) => ({
                        ...prev,
                        suggestedAssignee: e.target.value,
                      }))
                    }
                    maxLength={256}
                    id="task-suggested"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Assignee&apos;s name or email address.
                    </span>
                    <span
                      className={`label-text-alt ${
                        taskData.suggestedAssignee.length > 256
                          ? 'text-error'
                          : 'text-success'
                      }`}
                    >
                      {taskData.suggestedAssignee.length}/256
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {(createMutation.isError || editMutation.isError) && (
        <Alert type="error">
          Well, this is embarrassing. I&apos;m afraid something has gone wrong.
          It&apos;s us, not you. Try again in a minute?
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {/* <pre>{JSON.stringify(taskData, null, 2)}</pre>
        <pre>{JSON.stringify(session, null, 2)}</pre> */}
        <div className="form-control w-full pb-2">
          <label className="label" htmlFor="task-title">
            <span>Give the task a descriptive title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Design the flyers"
            className="input-bordered input w-full"
            value={taskData.title}
            disabled={!canAlterTask()}
            onChange={(e) =>
              setTaskData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            required
            minLength={6}
            maxLength={256}
            id="task-title"
          />
          <label className="label">
            <span className="label-text-alt">
              Keep this to between 6 and 256 characters.
            </span>
            <span
              className={`label-text-alt ${
                taskData.title.length < 6 || taskData.title.length > 256
                  ? 'text-error'
                  : 'text-success'
              }`}
            >
              {taskData.title.length}/256
            </span>
          </label>
        </div>
        <div className="form-control w-full pb-2">
          <TaskPriority
            value={taskData.priority}
            update={handleUpdatePriority}
            disabled={!canAlterTask()}
            colors={false}
            size="md"
            id={taskData.id || (new Date().getSeconds() as unknown as string)}
          />
        </div>
        <div className="form-control w-full pb-2">
          <label className="label" htmlFor="task-description">
            <span>
              Feel the need to add more detail?{' '}
              <span className="label-text-alt">(optional)</span>
            </span>
          </label>
          <textarea
            placeholder="e.g. The flyers should contain the following..."
            className="textarea-bordered textarea w-full"
            value={taskData.description}
            disabled={!canAlterTask()}
            onChange={(e) =>
              setTaskData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            maxLength={1024}
            id="task-description"
          ></textarea>
          <label className="label">
            <span className="label-text-alt">
              No more than 1024 characters.
            </span>
            <span
              className={`label-text-alt ${
                taskData.description.length > 1024
                  ? 'text-error'
                  : 'text-success'
              }`}
            >
              {taskData.description.length}/1024
            </span>
          </label>
        </div>
        <div className="form-control w-full pb-2">
          <DatePicker
            selected={taskData.dueDate}
            minDate={addDays(new Date(), 1)}
            onChange={(date: Date | null) =>
              setTaskData((prev) => ({
                ...prev,
                dueDate: date,
              }))
            }
            isClearable
            customInput={<DatepickerCustomInput />}
            dateFormat="dd/MM/yyyy"
            placeholderText="Click to select a date"
            calendarStartDay={1}
          />
        </div>

        {/* Attachments */}
        <div className="mb-8 rounded-lg bg-yellow-100 px-4 pt-4">
          <div className="form-control w-full">
            <Attachments
              data={taskData}
              attachments={task?.attachments}
              update={handleUpdateAttachments}
              disabled={!canAlterTask()}
            ></Attachments>
          </div>
        </div>

        {mode === 'create' && (
          <div className="mb-2 rounded-lg bg-pink-100 px-4 pt-4">
            <div className="form-control w-full pb-2">
              <div className="form-control">
                <label className="label cursor-pointer" htmlFor="task-claimed">
                  <span>
                    Think you can do this? Claim this task{' '}
                    <span className="label-text-alt">(optional)</span>
                  </span>
                  <input
                    type="checkbox"
                    className="toggle-success toggle"
                    checked={taskData.claimed}
                    id="task-claimed"
                    onChange={() => handleClaimTask()}
                  />
                </label>
              </div>
            </div>
            <div className="form-control w-full pb-2">
              <label className="label" htmlFor="task-suggested">
                <span>Assign this task to someone else?</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                className="input-bordered input w-full"
                value={taskData.suggestedAssignee}
                disabled={taskData.claimed}
                onChange={(e) =>
                  setTaskData((prev) => ({
                    ...prev,
                    suggestedAssignee: e.target.value,
                  }))
                }
                maxLength={256}
                id="task-suggested"
              />
              <label className="label">
                <span className="label-text-alt">
                  Assignee&apos;s name or email address.
                </span>
                <span
                  className={`label-text-alt ${
                    taskData.suggestedAssignee.length > 256
                      ? 'text-error'
                      : 'text-success'
                  }`}
                >
                  {taskData.suggestedAssignee.length}/256
                </span>
              </label>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div className="form-control w-full pb-2">
            <label className="label" htmlFor="task-comment">
              {canAlterTask() ? (
                <span>
                  As this is your task, feel free to add any further comments{' '}
                  <span className="label-text-alt">(optional)</span>
                </span>
              ) : (
                <span>Task comments</span>
              )}
            </label>
            <textarea
              placeholder="e.g. Done. The flyers will be available to pick up on Tuesday 9th June"
              className="textarea-bordered textarea w-full"
              value={taskData.comment}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              disabled={!canAlterTask()}
              maxLength={1024}
              id="task-comment"
            ></textarea>
            <label className="label">
              <span className="label-text-alt">
                No more than 1024 characters.
              </span>
              <span
                className={`label-text-alt ${
                  taskData.description.length > 1024
                    ? 'text-error'
                    : 'text-success'
                }`}
              >
                {taskData.comment.length}/1024
              </span>
            </label>
          </div>
        )}

        <div className="modal-action">
          {canAlterTask() ? (
            <>
              <button
                type="button"
                onClick={handleQuit}
                className="btn-ghost btn"
              >
                Forget it
              </button>
              <button
                type="button"
                className="btn-error btn"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className={`btn-primary btn ${
                  createMutation.isLoading || editMutation.isLoading
                    ? 'loading'
                    : ''
                }`}
                disabled={!handleValidate()}
              >
                {task ? 'Update' : 'Create'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleQuit}
              className="btn-ghost btn"
            >
              Back to list
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default TaskForm;
