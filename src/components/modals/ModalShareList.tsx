import Link from 'next/link';
import Copy from '../shared/Copy';

interface IProps {
  path: string;
}

const ModalShareList = (props: IProps) => {
  const { path } = props;
  return (
    <>
      <input
        type="checkbox"
        id="modal-share-list"
        className="modal-toggle"
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modal-share-list"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Many hands...</h3>
          <p className="py-4">
            Copy the link below and send it to whoever you like. They&apos;ll be
            able to pick up tasks, and add tasks themselves. But don&apos;t
            worry, they can&apos;t change your list details, or delete your list
            - you&apos;ll always be the list boss!
          </p>
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

export default ModalShareList;
