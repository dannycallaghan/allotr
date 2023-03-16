import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import Alert from '../shared/Alert';

interface IProps {
  listId: string;
  listOwner: string;
}

const ModalDeleteList = (props: IProps) => {
  const router = useRouter();
  const deleteMutation = api.list.deleteList.useMutation({
    onError: (error: unknown) => {
      console.error('Could not delete list:', error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: props.listId, authorId: props.listOwner });
    router.push('/');
  };
  return (
    <>
      <input
        type="checkbox"
        id="modal-delete-list"
        className="modal-toggle"
        readOnly
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="modal-delete-list"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Whoa there - are you sure?</h3>
          <p className="py-4">
            Once this list is deleted, there is no way of getting it back; and
            anyone who you have shared this list with will also lose it. Are you
            certain?
          </p>
          {deleteMutation.isError && (
            <Alert type="error">
              Well, this is embarrassing. I&apos;m afraid something has gone
              wrong. It&apos;s us, not you. Try again in a minute?
            </Alert>
          )}
          <div className="modal-action">
            <label className="btn" htmlFor="modal-delete-list">
              No, forget it
            </label>
            <button
              className={`btn-error btn ${
                deleteMutation.isLoading ? 'loading' : ''
              }`}
              onClick={handleDelete}
            >
              Yes, delete it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDeleteList;
