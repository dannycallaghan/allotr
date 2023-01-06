import { format } from 'date-fns';

export const FRIENDLY_DATE_FORMAT = 'h:mmaa EEEE do MMMM yyyy';

export function formatAsFriendlyDate(date: Date) {
  return format(date, FRIENDLY_DATE_FORMAT);
}

export function capitaliseFirstLetter(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
}
