import { add, format } from 'date-fns';

export function formatAsFriendlyDate(
  date: Date | string | number | undefined,
  time,
  prefix = '',
) {
  if (!date) return '';
  let input = date;
  if (typeof input === 'string') {
    input = Number(date);
  }
  if (time) {
    return `${prefix} ${format(input, 'h:mmaa')} on ${format(
      input,
      'EEEE do MMMM yyyy',
    )}`;
  }
  return `${prefix} ${format(input, 'EEEE do MMMM yyyy')}`;
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

export function scrollToSmoothly(position: number, duration: number): void {
  let pos = position;
  let time = duration;
  if (typeof pos !== 'number') {
    pos = parseFloat(pos);
  }
  if (isNaN(pos)) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'Position must be a number';
  }
  if (pos < 0 || time < 0) {
    return;
  }
  const currentPos = window.scrollY || window.screenTop;
  let start: null | number = null;
  time = time || 500;
  window.requestAnimationFrame(function step(currentTime: number) {
    start = !start ? currentTime : start;
    if (currentPos < pos) {
      const progress = currentTime - start;
      window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    } else {
      const progress = currentTime - start;
      window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    }
  });
}
