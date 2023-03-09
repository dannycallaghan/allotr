/* eslint-disable @next/next/no-img-element */
import type { Task } from '../../types/types';
import type { File } from './Attachments';
import { formatAsFriendlyDate } from '../../utils/utils';
import RemoveAttachmentButton from './RemoveAttachmentButton';

interface IProps {
  file: File;
  data: Task;
  remove: (id: string) => void;
}

const Attachments = (props: IProps) => {
  const { data, file, remove } = props;

  return (
    <>
      <div className="mb-4 flex flex-col rounded-lg bg-white p-2 sm:flex-row">
        <div className="flex justify-center">
          <div className="h-20 w-20 overflow-hidden rounded-md bg-gray-100">
            <a href={file.secure_url} target="_blank" rel="noreferrer">
              {file.thumbnail_url ? (
                <img
                  src={file.thumbnail_url}
                  className="w-full"
                  alt={file.secure_url}
                />
              ) : (
                <span className="block h-full w-full">&nbsp;</span>
              )}
            </a>
          </div>
        </div>
        <div className="block flex-grow overflow-hidden text-ellipsis p-4">
          <p>
            <a
              href={file.secure_url}
              className="block overflow-hidden text-ellipsis text-primary underline"
              target="_blank"
              rel="noreferrer"
            >
              {file.secure_url}
            </a>
          </p>
          <p>Added {formatAsFriendlyDate(new Date(file.created_at), true)}</p>
          <div className="flex justify-end">
            <RemoveAttachmentButton
              data={data}
              remove={() => remove(file.id)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Attachments;
