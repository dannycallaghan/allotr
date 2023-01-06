import Link from 'next/link';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import ModalDeleteList from '../modals/ModalDeleteList';

interface IProps {
  listId: string;
  listOwner: string;
}

const ListControls = (props: IProps) => {
  const { listId, listOwner } = props;
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
          Delete this list
        </label>
        <Link href={`/list/edit/${listId}`}>
          <button className="btn-primary btn-sm btn">
            <span className="pr-2 text-lg">
              <FiEdit />
            </span>
            Edit list details
          </button>
        </Link>
      </div>
      <ModalDeleteList listId={listId} listOwner={listOwner} />
    </>
  );
};

export default ListControls;
