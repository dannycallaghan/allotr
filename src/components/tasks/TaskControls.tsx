import Link from 'next/link';
import type { Task } from '../../types/types';
import DeleteTaskButton from './DeleteTaskButton';

interface IProps {
  data: Task;
  remove: () => void;
}

const TaskControls = (props: IProps) => {
  const { data, remove } = props;
  return (
    <>
      <Link
        href={`/${data.listId}/${data.id}`}
        className="btn-primary btn-sm btn"
      >
        <span className="pr-2 text-lg"></span>
        Edit task
      </Link>
      <DeleteTaskButton data={data} remove={remove} />
    </>
  );
};

export default TaskControls;
