import { useState } from 'react';
import Link from 'next/link';
import Copy from '../shared/Copy';

interface IProps {
  listId: string;
  host: string;
}

const ModalListCreated = (props: IProps) => {
  const { host, listId } = props;
  const [done, setDone] = useState<boolean>(false);
  const [open] = useState<boolean>(true);

  return (
    <>
      <input
        type="checkbox"
        id="modal-list-link"
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <h3 className="text-lg font-bold">Whoa, that&apos;s a fine list</h3>
          <p className="py-2">
            Your list has been created, now let&apos;s start adding some tasks
            to it!
          </p>
          <p className="py-2">
            Remember, many hands make light work, so start sharing the load. You
            can already share this list, using the link below, with anyone you
            like - no limits!
          </p>
          <p className="flex py-4 text-sm">
            <Link href={`${host}/${listId}`} className="truncate underline">
              {`${host}/${listId}`}
            </Link>
            <Copy path={`${host}/${listId}`} />
          </p>
          <div className="modal-action">
            <Link href="/">
              <button className="btn-ghost btn">Return home</button>
            </Link>
            <Link href={`${host}/${listId}`}>
              <button
                className={`btn-primary btn ${done ? 'loading' : ''}`}
                onClick={() => setDone(true)}
              >
                Add some tasks
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalListCreated;
