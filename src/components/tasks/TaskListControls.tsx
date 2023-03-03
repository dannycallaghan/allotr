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
    <>
      <TaskListFilters
        listControls={listControls}
        handleValueChange={handleValueChange}
      />
      <TaskListOrder
        listControls={listControls}
        handleValueChange={handleValueChange}
      />
    </>
  );
};

export default TaskListControls;
