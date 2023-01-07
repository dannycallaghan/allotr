import Link from 'next/link';
import { FiTrash2, FiEdit, FiShare2 } from 'react-icons/fi';
import ModalDeleteList from '../modals/ModalDeleteList';
import ModalShareList from '../modals/ModalShareList';

interface IProps {
  listId: string;
  listOwner: string;
  path: string;
}

const ListControls = (props: IProps) => {
  const { listId, listOwner, path } = props;
  return (
    <>
      <div className="flex flex-wrap gap-2 pb-6">
        <label
          htmlFor="modal-delete-list"
          className="btn-error btn-sm btn leading-like-btn-sm"
        >
          <span className="pr-2 text-lg">
            <FiTrash2 />
          </span>
          Delete list
        </label>
        <label
          htmlFor="modal-share-list"
          className="btn-accent btn-sm btn leading-like-btn-sm"
        >
          <span className="pr-2 text-lg">
            <FiShare2 />
          </span>
          Share list
        </label>
        <Link href={`/list/edit/${listId}`}>
          <button className="btn-info btn-sm btn">
            <span className="pr-2 text-lg">
              <FiEdit />
            </span>
            Edit list details
          </button>
        </Link>
      </div>
      <ModalDeleteList listId={listId} listOwner={listOwner} />
      <ModalShareList path={path} />
    </>
  );
};

export default ListControls;
