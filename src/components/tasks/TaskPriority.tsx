import { useState, useEffect } from 'react';

interface IProps {
  update: (value: number) => void;
  value: number;
  disabled: boolean;
  labels?: boolean;
  colors: boolean;
}

const TaskPriority = (props: IProps) => {
  const { update, value, disabled, labels = true, colors } = props;
  const [priority, setPriority] = useState<number>(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(Number(e.currentTarget.dataset.index));
  };

  let priorityClass = 'bg-green-700';

  switch (priority) {
    case 1:
      priorityClass = 'bg-yellow-400';
      break;
    case 2:
      priorityClass = 'bg-yellow-600';
      break;
    case 4:
      priorityClass = 'bg-red-500';
      break;
    case 5:
      priorityClass = 'bg-red-800';
      break;
    default:
      priorityClass = 'bg-green-700';
  }

  useEffect(() => {
    update(priority);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority]);

  return (
    <>
      <p className="label">
        <span>How important is this task?</span>
      </p>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((radio) => (
          <input
            key={radio}
            type="radio"
            name="task-priority"
            checked={priority === radio}
            data-index={radio}
            id={`priority-${radio}`}
            disabled={disabled}
            onChange={handleChange}
            className={`mask mask-star-2 ${priorityClass} ${
              !colors
                ? priority >= radio
                  ? 'disabled:bg-gray-700'
                  : 'disabled:bg-gray-500'
                : ''
            }`}
          />
        ))}
        {labels && (
          <div className="pl-2">
            <label
              className={
                priority === 1 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor="priority-1"
            >
              Would be nice
            </label>
            <label
              className={
                priority === 2 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor="priority-2"
            >
              Low priority
            </label>
            <label
              className={
                priority === 3 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor="priority-3"
            >
              Normal priority
            </label>
            <label
              className={
                priority === 4 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor="priority-4"
            >
              Medium priority
            </label>
            <label
              className={
                priority === 5 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor="priority-5"
            >
              High priority
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPriority;
