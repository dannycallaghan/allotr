import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Task, CreateTaskInput } from '../../types/types';
import { api } from '../../utils/api';
import { getTomorrow } from '../../utils/utils';
import Alert from '../shared/Alert';
import Datepicker from 'react-tailwindcss-datepicker';

interface IProps {
  action: (task: Task) => void;
  listId: string;
  isOpen: boolean;
  setOpen: () => void;
  task?: Task | null;
}

interface IDateObj {
  startDate: string;
  endDate: string;
}

const ModalTask = (props: IProps) => {
  const { action, listId, isOpen, setOpen, task } = props;
  const initialTaskData: () => CreateTaskInput = () => {
    return {
      title: '',
      isComplete: false,
      listId,
      dueDate: getTomorrow(),
      hasDueDate: false,
    };
  };
  const [taskData, setTaskData] = useState<CreateTaskInput>(initialTaskData);

  const [dueDateValue, setDueDateValue] = useState<IDateObj>({
    startDate: '',
    endDate: '',
  });

  const createMutation = api.list.createTask.useMutation({
    onSuccess: (data: unknown) => {
      action(data as Task);
      handleClose();
      toast.success('New task added!');
    },
    onError: (error) => {
      console.error('Could not create task:', error);
    },
  });

  const editMutation = api.list.updateTask.useMutation({
    onSuccess: (data: unknown) => {
      action(data as Task);
      handleClose();
      toast.success('Task updated!');
    },
    onError: (error) => {
      console.error('Could not edit task:', error);
    },
  });

  const handleReset = () => {
    setTaskData(initialTaskData);
  };

  const handleClose = () => {
    handleReset();
    setOpen();
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (task) {
      editMutation.mutate({
        ...taskData,
        dueDate: dueDateValue.startDate,
        id: task.id,
      });
      return;
    }
    createMutation.mutate({ ...taskData, dueDate: dueDateValue.startDate });
  };

  const handleValidate = () => {
    return taskData.title.length > 6 && taskData.title.length < 256;
  };

  const handleDueDateChange = (newValue: IDateObj) => {
    setDueDateValue(newValue);
  };

  useEffect(() => {
    if (task) {
      setTaskData(() => ({
        title: task.title,
        isComplete: task.isComplete,
        listId: task.listId,
        dueDate: task.dueDate,
        hasDueDate: task.hasDueDate,
      }));
    }
  }, [task]);

  return (
    <>
      <input
        type="checkbox"
        id="modal-task-${modelId}"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <button
            onClick={handleClose}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </button>
          <h1 className="text-3xl font-bold">
            {task ? 'Edit' : 'Create'} task
          </h1>
          <p className="py-4">Got a new task, huh? All we need is a title.</p>
          {(createMutation.isError || editMutation.isError) && (
            <Alert type="error">
              Well, this embarrassing. I&apos;m afraid something has gone wrong.
              It&apos;s us, not you. Try again in a minute?
            </Alert>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-control w-full pb-6">
              <label className="label" htmlFor="list-title">
                <span>Give your task a descriptive title</span>
              </label>
              <textarea
                placeholder="e.g. Design flyers"
                className="textarea-bordered textarea w-full"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
                minLength={6}
                maxLength={256}
                id="list-title"
              ></textarea>
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
              <Datepicker
                value={dueDateValue}
                primaryColor={'sky'}
                asSingle={true}
                onChange={handleDueDateChange}
                useRange={false}
                displayFormat={'DD/MM/YYYY'}
                readOnly={true}
                minDate={new Date()}
                startWeekOn="mon"
                showFooter={true}
                inputClassName="font-normal bg-green-100 dark:bg-green-900 dark:placeholder:text-green-100"
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalTask;
