import { useState } from 'react';
import Link from 'next/link';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';

interface IProps {
  listId: string;
  host: string;
}

const ModalListLink = (props: IProps) => {
  const { host, listId } = props;
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState<boolean>(false);

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
          <label
            htmlFor="modal-list-link"
            onClick={() => setOpen((prev) => !prev)}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Whoa, great work!</h3>
          <p className="py-4">
            Many hands make light work, so start sharing the load. Send the link
            below to anyone you like - no limits!
          </p>
          <p className="flex py-4 text-sm">
            <Link
              href={`${host}/${listId}`}
              className="truncate underline"
            >{`${host}/${listId}`}</Link>
            <CopyToClipboard
              text={`${host}/${listId}`}
              onCopy={() => setCopied(true)}
            >
              {copied ? (
                <span className="pl-2 text-sm text-accent-focus">Copied!</span>
              ) : (
                <button className="pl-2 text-lg text-accent-focus">
                  <FiCopy />
                </button>
              )}
            </CopyToClipboard>
          </p>
        </div>
      </div>
    </>
  );
};

export default ModalListLink;
