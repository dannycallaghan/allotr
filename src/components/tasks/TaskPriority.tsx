import { useState, useEffect } from 'react';

interface IProps {
  update?: (value: number) => void;
  value: number;
  disabled: boolean;
  labels?: boolean;
  colors: boolean;
  id: string;
  size: string;
  completed?: boolean;
}

const TaskPriority = (props: IProps) => {
  const {
    update,
    value,
    disabled,
    labels = true,
    colors,
    id,
    size,
    completed = false,
  } = props;
  const [priority, setPriority] = useState<number>(value);
  const priorityClass = completed ? 'bg-gray-400' : 'bg-red-500';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(Number(e.currentTarget.dataset.index));
  };

  useEffect(() => {
    if (update) {
      update(priority);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priority]);

  return (
    <>
      {labels && (
        <p className="label">
          <span>How important is this task?</span>
        </p>
      )}
      <div className={`rating rating-${size}`}>
        {[1, 2, 3, 4, 5].map((radio) => (
          <input
            key={radio}
            type="radio"
            name={`task-priority-${id}`}
            checked={priority === radio}
            data-index={radio}
            id={`priority-${radio}-${id}`}
            disabled={disabled}
            onChange={handleChange}
            className={`mask mask-star-2 ${priorityClass} ${
              !colors
                ? priority >= radio
                  ? 'disabled:bg-gray-700'
                  : 'disabled:bg-gray-500'
                : ''
            } ${size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'}`}
          />
        ))}
        {labels && (
          <div className="pl-2">
            <p
              className={
                priority === 0 ? 'label-text-alt inline-block' : 'hidden'
              }
            >
              No priority
            </p>
            <label
              className={
                priority === 1 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor={`priority-1-${id}`}
            >
              Would be nice
            </label>
            <label
              className={
                priority === 2 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor={`priority-2-${id}`}
            >
              Low priority
            </label>
            <label
              className={
                priority === 3 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor={`priority-3-${id}`}
            >
              Normal priority
            </label>
            <label
              className={
                priority === 4 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor={`priority-4-${id}`}
            >
              Medium priority
            </label>
            <label
              className={
                priority === 5 ? 'label-text-alt inline-block' : 'hidden'
              }
              htmlFor={`priority-5-${id}`}
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
