import Link from 'next/link';
import Copy from '../shared/Copy';

interface IProps {
  path: string;
  type: string;
}

const ModalShareItem = (props: IProps) => {
  const { path, type } = props;
  return (
    <>
      <input
        type="checkbox"
        id="modal-share-item"
        className="modal-toggle"
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modal-share-item"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Many hands...</h3>
          {type === 'task' ? (
            <p className="py-4">
              Copy the link below and send it to whoever you like. If the task
              is not already claimed, they&apos;ll be able to claim the task and
              update it. However, only the task creator can delete the task.
            </p>
          ) : (
            <p className="py-4">
              Copy the link below and send it to whoever you like. They&apos;ll
              be able to pick up tasks, and add tasks themselves. However, only
              the list creator will be able to change the list details, or
              delete the list.
            </p>
          )}
          <p className="flex py-4 text-sm">
            <Link href={`${path}`} className="truncate underline">
              {`${path}`}
            </Link>
            <Copy path={`${path}`} />
          </p>
        </div>
      </div>
    </>
  );
};

export default ModalShareItem;
