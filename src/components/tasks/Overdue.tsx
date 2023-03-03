import { isAfter, set } from 'date-fns';

interface IProps {
  due: Date;
}

const Overdue = (props: IProps) => {
  const { due } = props;
  const formattedDue = set(due, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const today = set(new Date(), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const overdue = isAfter(today, formattedDue);

  return (
    <>
      {overdue && (
        <span className="badge-error badge ml-2 font-bold text-white">
          OVERDUE
        </span>
      )}
    </>
  );
};

export default Overdue;
