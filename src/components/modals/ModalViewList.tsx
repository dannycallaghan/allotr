import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from '../../utils/api';

interface IProps {
  cancel: () => void;
  listId: string;
}

const Cancel = () => {
  return (
    <label htmlFor="modal-view-list" className="btn-ghost btn">
      Forget it
    </label>
  );
};

const Loading = () => {
  return (
    <div className="modal-action">
      <Cancel />
      <button className="loading btn-primary btn">Find this list</button>
    </div>
  );
};

const FindList = (props: IProps) => {
  const { cancel, listId } = props;
  const { data: list, isLoading } = api.list.getListById.useQuery({
    id: listId,
  });
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !list) {
    return (
      <>
        <div className="alert alert-error shadow-lg">
          <div>
            <span>
              Sorry, can&apos;t find that list.
              <button onClick={cancel} className="underline">
                Try again?
              </button>
            </span>
          </div>
        </div>
        <div className="modal-action">
          <Cancel />
          <button className="btn-primary btn" disabled>
            Find this list
          </button>
        </div>
      </>
    );
  }

  if (list) {
    router.push(`/${listId}`);
    return <Loading />;
  }

  return null;
};

const ModalViewList = () => {
  const [findingList, setFindingList] = useState(false);
  const [listId, setListId] = useState<string>('');

  const handleFindList = () => {
    setFindingList((prevState) => !prevState);
  };

  return (
    <>
      <input type="checkbox" id="modal-view-list" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label className="text-lg font-bold" htmlFor="list-id">
            Enter the unique code for this list
          </label>
          <div className="form-control w-full pt-4">
            <input
              type="text"
              placeholder="Enter unique code"
              className="input-bordered input w-full"
              id="list-id"
              onChange={(e) => setListId(e.target.value)}
              minLength={25}
              maxLength={25}
              disabled={findingList}
            />
            <label className="label">
              <span className="label-text-alt">
                This should look like 25 random characters
              </span>
            </label>
          </div>
          {findingList && <FindList cancel={handleFindList} listId={listId} />}
          {!findingList && (
            <div className="modal-action">
              <Cancel />
              <button
                className="btn-primary btn"
                onClick={handleFindList}
                disabled={listId.length < 24}
              >
                Find this list
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalViewList;
