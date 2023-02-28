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
    <div className="mb-4 rounded-lg bg-white">
      <div
        style={{ backgroundImage: `url(${file.secure_url})` }}
        className="h-20 max-h-20 rounded-t-lg bg-cover bg-center"
      ></div>
      <div className="p-4">
        <p className="overflow-hidden text-ellipsis">
          <a
            href={file.secure_url}
            className="text-primary underline"
            target="_blank"
            rel="noreferrer"
          >
            {file.secure_url}
          </a>
        </p>
        <p>Added {formatAsFriendlyDate(new Date(file.created_at))}</p>
        <div className="flex justify-end">
          <RemoveAttachmentButton data={data} remove={() => remove(file.id)} />
        </div>
      </div>
    </div>
  );
};

export default Attachments;
