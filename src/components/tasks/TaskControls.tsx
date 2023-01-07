import { FiEdit } from 'react-icons/fi';
import type { Task } from '../../types/types';
import DeleteTaskButton from './DeleteTaskButton';
import ToggleTaskStatus from './ToggleTaskStatus';

interface IProps {
  setOpen: () => void;
  data: Task;
  remove: () => void;
  toggleStatus: (state: boolean) => void;
  display?: string[];
  completed: boolean;
}

const TaskControls = (props: IProps) => {
  const { setOpen, data, remove } = props;
  return (
    <>
      <button onClick={setOpen} className="btn-primary btn-sm btn">
        <span className="pr-2 text-lg"></span>
        Edit task
      </button>
      <DeleteTaskButton data={data} remove={remove} />
    </>
  );
};

export default TaskControls;
