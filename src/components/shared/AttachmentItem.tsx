import { formatAsFriendlyDate } from '../../utils/utils';
import { Image } from './Attachments';

interface IProps {
  data: Image;
}

const Attachments = (props: IProps) => {
  const { data } = props;

  return (
    <div className="lg:flex">
      {data.thumbnail_url && (
        <img
          className="h-24 w-24 rounded-lg object-cover"
          src={data.thumbnail_url}
          alt={`Attachment ${data.id}`}
        />
      )}
      {!data.thumbnail_url && (
        <div className="h-24 w-24 rounded-lg bg-gray-800 object-cover"></div>
      )}
      <div className="mx-6 flex flex-col justify-between py-6">
        <span className="text-sm">
          Added {formatAsFriendlyDate(new Date(data.created_at))}
        </span>
      </div>
    </div>
  );
};

export default Attachments;
