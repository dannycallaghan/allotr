import { forwardRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Task, CreateTaskInput } from '../../types/types';
import { api } from '../../utils/api';
import Alert from '../shared/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';
import router, { useRouter } from 'next/router';
import Attachments, { Image } from '../shared/Attachments';

interface IProps {
  task?: Task | null;
}

const TaskForm = (props: IProps) => {
  const router = useRouter();
  const routeData = router.query;
  const listId = routeData.list || '1';

  const { task } = props;
  const initialTaskData: () => CreateTaskInput = () => {
    return {
      title: '',
      isComplete: false,
      listId,
      dueDate: null,
      description: '',
      assignee: '',
      comment: '',
      attachments: '',
    };
  };
  const [taskData, setTaskData] = useState<CreateTaskInput>(initialTaskData);

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

  const handleUpdateAttachments = (attachments: Image[]) => {
    console.log(attachments);
    setTaskData((prev) => ({
      ...prev,
      attachments: JSON.stringify(attachments),
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (task) {
      editMutation.mutate({
        ...taskData,
        id: task.id,
      });
      return;
    }
    createMutation.mutate({ ...taskData });
  };

  const handleValidate = () => {
    return taskData.title.length > 6 && taskData.title.length < 256;
  };

  useEffect(() => {
    setTaskData((prev) => ({
      ...prev,
      listId: routeData.list as string,
    }));
  }, [routeData]);

  // eslint-disable-next-line react/display-name
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
        />
      </div>
    );
  });

  useEffect(() => {
    if (task) {
      setTaskData(() => ({
        title: task.title,
        isComplete: task.isComplete,
        listId: task.listId,
        dueDate: task.dueDate,
        description: task.description,
        assignee: task.assignee,
        comment: task.comment,
        attachments: task.attachments,
      }));
    }
  }, [task]);

  return (
    <>
      <p className="py-4">Got a new task, huh? All we need is a title.</p>
      {(createMutation.isError || editMutation.isError) && (
        <Alert type="error">
          Well, this is embarrassing. I&apos;m afraid something has gone wrong.
          It&apos;s us, not you. Try again in a minute?
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-control w-full pb-2">
          <label className="label" htmlFor="task-title">
            <span>Give your task a descriptive title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Design the flyers"
            className="input-bordered input w-full"
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
        <div className="form-control w-full pb-2">
          <label className="label" htmlFor="task-assignee">
            <span>Assign this task to someone?</span>
          </label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            className="input-bordered input w-full"
            value={taskData.assignee}
            onChange={(e) =>
              setTaskData((prev) => ({
                ...prev,
                assignee: e.target.value,
              }))
            }
            maxLength={256}
            id="task-assignee"
          />
          <label className="label">
            <span className="label-text-alt">
              Assignee&apos;s name or email address.
            </span>
            <span
              className={`label-text-alt ${
                taskData.title.length > 256 ? 'text-error' : 'text-success'
              }`}
            >
              {taskData.assignee.length}/256
            </span>
          </label>
        </div>
        <div className="form-control w-full pb-2">
          <Attachments
            attachments={taskData.attachments}
            update={handleUpdateAttachments}
          />
        </div>
        <div className="form-control w-full pb-2">
          <label className="label" htmlFor="task-comment">
            <span>
              As this is your task, feel free to add any further comments{' '}
              <span className="label-text-alt">(optional)</span>
            </span>
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
        <div className="modal-action">
          <button type="button" onClick={handleQuit} className="btn-ghost btn">
            Forget it
          </button>
          <button type="button" className="btn-error btn" onClick={handleReset}>
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
    </>
  );
};

export default TaskForm;
