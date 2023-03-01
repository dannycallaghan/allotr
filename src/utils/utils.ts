import { add, format } from 'date-fns';

export const FRIENDLY_DATE_FORMAT = 'h:mmaa EEEE do MMMM yyyy';

export function formatAsFriendlyDate(
  date: Date | string | number | undefined,
  prefix = '',
) {
  if (!date) return '';
  let input = date;
  if (typeof input === 'string') {
    input = Number(date);
  }
  return `${prefix}${format(input, FRIENDLY_DATE_FORMAT)}`;
}

export function capitaliseFirstLetter(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
}

export function compareTime(a: Date | string, b: Date | string) {
  const a1 = new Date(a).getTime();
  const b1 = new Date(b).getTime();
  return a1 === b1;
}

export function getTomorrow() {
  return format(add(new Date(), { days: 1 }), 'dd/MM/yy');
}

export function isEmail(mail: string) {
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    'gm',
  );
  return emailRegex.test(mail);
}
