import { FiTrash2, FiEdit, FiShare2 } from 'react-icons/fi';
import ModalDeleteList from '../modals/ModalDeleteList';
import ModalShareList from '../modals/ModalShareList';
import AuthAction from '../shared/AuthAction';

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
        <AuthAction
          type="label"
          htmlFor="modal-delete-list"
          classes="btn-error btn-sm btn leading-like-btn-sm"
          match={[listOwner]}
        >
          <span className="pr-2 text-lg">
            <FiTrash2 />
          </span>
          Delete list
        </AuthAction>
        <label
          htmlFor="modal-share-list"
          className="btn-accent btn-sm btn leading-like-btn-sm"
        >
          <span className="pr-2 text-lg">
            <FiShare2 />
          </span>
          Share list
        </label>
        <AuthAction
          type="link"
          href={`/list/edit/${listId}`}
          classes="btn-info btn-sm btn"
          match={[listOwner]}
        >
          <span className="pr-2 text-lg">
            <FiEdit />
          </span>
          Edit list details
        </AuthAction>
      </div>
      <ModalDeleteList listId={listId} listOwner={listOwner} />
      <ModalShareList path={path} />
    </>
  );
};

export default ListControls;
