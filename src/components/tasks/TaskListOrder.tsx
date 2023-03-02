import { GoTriangleDown } from 'react-icons/go';
import type { ListControls } from '../../pages/[list]';

interface IProps {
  listControls: ListControls;
  handleValueChange: (data: ListControls) => void;
}

const TaskListOrder = (props: IProps) => {
  const { listControls, handleValueChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = listControls;
    data.by = e.currentTarget.name;
    handleValueChange(data);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom ml-2">
        <button tabIndex={0} className="btn-sm btn m-1">
          <span className="pr-2">
            <GoTriangleDown />
          </span>
          Order list
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content rounded bg-base-100 p-2 shadow"
        >
          <li>
            <div className="form-control">
              <label className="label w-full cursor-pointer">
                <div className="flex w-full">
                  <span className="label-text flex-grow whitespace-nowrap pr-2">
                    Newest first
                  </span>
                  <input
                    name="createdAtNewest"
                    type="checkbox"
                    checked={listControls.by === 'createdAtNewest'}
                    className="checkbox"
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label w-full cursor-pointer">
                <div className="flex w-full">
                  <span className="label-text flex-grow whitespace-nowrap pr-2">
                    Oldest first
                  </span>
                  <input
                    name="createdAtOldest"
                    type="checkbox"
                    checked={listControls.by === 'createdAtOldest'}
                    className="checkbox"
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label w-full cursor-pointer">
                <div className="flex w-full">
                  <span className="label-text flex-grow whitespace-nowrap pr-2">
                    By priority
                  </span>
                  <input
                    name="priority"
                    type="checkbox"
                    checked={listControls.by === 'priority'}
                    className="checkbox"
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </li>
          <li>
            <div className="form-control">
              <label className="label w-full cursor-pointer">
                <div className="flex w-full">
                  <span className="label-text flex-grow whitespace-nowrap pr-2">
                    Due date (soonest)
                  </span>
                  <input
                    name="dueDate"
                    type="checkbox"
                    checked={listControls.by === 'dueDate'}
                    className="checkbox"
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TaskListOrder;
