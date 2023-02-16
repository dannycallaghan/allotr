import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import MainLayout from '../../components/shared/MainLayout';
import TaskForm from '../../components/tasks/TaskForm';

const CreateTask: NextPage = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    return () => {
      if (init) {
        const iframe = document.querySelector('iframe[data-test="uw-iframe"]');
        console.log(iframe);
        const js = document.querySelector('script[id^="cloudinary"]');
        console.log(js);

        if (iframe) iframe.remove();
        if (js) js.remove();
      }
      setInit(true);
    };
  }, [init, setInit]);

  return (
    <MainLayout classes="items-start pt-10" hero={false}>
      <TaskForm>
        <h1 className="overflow-hidden text-ellipsis pb-6 text-5xl font-bold">
          Add task
        </h1>
      </TaskForm>
    </MainLayout>
  );
};

export default CreateTask;
