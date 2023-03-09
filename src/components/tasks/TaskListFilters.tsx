import { GoTriangleDown } from 'react-icons/go';
import type { ListControls } from '../../pages/[list]';

interface IProps {
  listControls: ListControls;
  handleValueChange: (data: ListControls) => void;
}

const TaskListFilters = (props: IProps) => {
  const { listControls, handleValueChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = !listControls[name as keyof typeof listControls];

    const data: ListControls = listControls;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data[name] = value;

    if (value) {
      if (name === 'unclaimed') {
        data.my = false;
        data.open = true;
      }
      if (name === 'my' || name === 'open') {
        data.unclaimed = false;
      }
    }

    handleValueChange(data);
  };

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <button tabIndex={0} className="btn-sm btn">
          <span className="pr-2">
            <GoTriangleDown />
          </span>
          Filter list
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
                    Open tasks
                  </span>
                  <input
                    name="open"
                    type="checkbox"
                    checked={listControls.open}
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
                    My tasks
                  </span>
                  <input
                    name="my"
                    type="checkbox"
                    checked={listControls.my}
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
                    Unclaimed tasks
                  </span>
                  <input
                    name="unclaimed"
                    type="checkbox"
                    checked={listControls.unclaimed}
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

export default TaskListFilters;
