import type { ListControls } from '../../pages/[list]';
import TaskListFilters from './TaskListFilters';
import TaskListOrder from './TaskListOrder';

interface IProps {
  listControls: ListControls;
  handleValueChange: (data: ListControls) => void;
}

const TaskListControls = (props: IProps) => {
  const { listControls, handleValueChange } = props;

  return (
    <div className="w-full flex-grow justify-start">
      <TaskListFilters
        listControls={listControls}
        handleValueChange={handleValueChange}
      />
      <TaskListOrder
        listControls={listControls}
        handleValueChange={handleValueChange}
      />
    </div>
  );
};

export default TaskListControls;
