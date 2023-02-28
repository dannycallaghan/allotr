import type { Task } from '../../types/types';
import DeleteTaskButton from './DeleteTaskButton';
import AuthAction from '../shared/AuthAction';

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
        match={[data.assignee, data.authorId]}
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
