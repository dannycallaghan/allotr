import type { Task } from '../../types/types';
import AuthAction from '../shared/AuthAction';
import DeleteTaskButton from './DeleteTaskButton';

interface IProps {
  data: Task;
  remove: () => void;
}

const TaskControls = (props: IProps) => {
  const { data, remove } = props;
  return (
    <>
      <AuthAction
        type="link"
        href={`/${data.listId}/${data.id}`}
        match={[data?.assignee?.id, data.authorId]}
        classes="btn-primary btn-sm btn"
      >
        <span className="pr-2 text-lg"></span>
        Edit task
      </AuthAction>
      <DeleteTaskButton data={data} remove={remove} />
    </>
  );
};

export default TaskControls;
