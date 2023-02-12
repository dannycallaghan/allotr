import type { NextPage } from 'next';
import MainLayout from '../../components/shared/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';

const CreateTask: NextPage = () => {
  return (
    <MainLayout classes="items-start pt-10" hero={false}>
      <h1 className="overflow-hidden text-ellipsis pb-6 text-5xl font-bold">
        Add task
      </h1>
      <TaskForm />
    </MainLayout>
  );
};

export default CreateTask;
