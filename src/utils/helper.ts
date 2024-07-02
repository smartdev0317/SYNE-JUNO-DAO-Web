import { div, gt, isFinite, minus, multiple } from '@client/libs/math';
import { is } from 'ramda';
import { nativeDenom } from './constants';
import contracts from '../../contracts.json';
import CHAIN from '../../chain_info.json';

export const chainId = CHAIN['chainId'];

/* object */
export const record = <T, V>(
  object: T,
  value: V,
  skip?: (keyof T)[],
): Record<keyof T, V> =>
  Object.keys(object).reduce(
    (acc, cur) =>
      Object.assign({}, acc, {
        [cur]: skip?.includes(cur as keyof T) ? object[cur as keyof T] : value,
      }),
    {} as Record<keyof T, V>,
  );

export const omitEmpty = (object: object): object =>
  Object.entries(object).reduce((acc, [key, value]) => {
    const next = is(Object, value) ? omitEmpty(value) : value;
    const valid = Number.isFinite(value) || value;
    return Object.assign({}, acc, valid && { [key]: next });
  }, {});

/* array */
export const insertIf = <T>(condition?: any, ...elements: T[]) =>
  condition ? elements : [];

/* string */
export const getLength = (text: string) => new Blob([text]).size;
export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.slice(1);

export const title = (text: string) =>
  `Synergistic Protocol${text ? ' | ' + text : ''}`;

export const getVotingPercentage = (totalVoteCount: any, currCount: string) => {
  return isFinite(multiple(div(currCount, totalVoteCount), '100'))
    ? multiple(div(currCount, totalVoteCount), '100')
    : '0';
};

export const secondsToTimeConverter = (sec, showSeconds = true) => {
  const days = gt(Math.trunc(Number(div(sec, '86400'))), 0)
    ? Math.trunc(Number(div(sec, '86400'))) + 'D'
    : '';
  const remainingHoursAfterDays = gt(Math.trunc(Number(div(sec, '86400'))), 0)
    ? Math.trunc(
        Number(
          div(
            minus(
              sec,
              multiple(Math.trunc(Number(div(sec, '86400'))), '86400'),
            ),
            '3600',
          ),
        ),
      ) +
      'h' +
      ':'
    : gt(Math.trunc(Number(div(sec, '3600'))), 0)
    ? Math.trunc(Number(div(sec, '3600'))) + 'h' + ':'
    : '';
  const minutes = gt(Math.trunc(Number(div(sec, '60'))), 0)
    ? showSeconds
      ? Math.trunc(Number(div(sec, '60')) % 60) + 'm' + ':'
      : Math.trunc(Number(div(sec, '60')) % 60) + 'm'
    : '';
  const seconds = gt(Math.trunc(sec % 60), 0) ? Math.trunc(sec % 60) + 's' : '';
  const timeFormat = showSeconds
    ? days + remainingHoursAfterDays + minutes + seconds
    : days + remainingHoursAfterDays + minutes;

  return `${timeFormat}`;
};
export const getUnstakingPeriod = (sec) => {
  return Math.trunc(Number(div(sec, '86400')));
};
export const getTotalTime = (startTime, endTime) => {
  return Math.floor(Number(minus(div(endTime, '1000000000'), startTime)));
};

export const getRemainingTime = (startTime) => {
  return Math.floor(Number(minus(div(Date.now(), '1000'), startTime)));
};
export const tokens = [
  {
    text: '$JUNO',
    value: nativeDenom,
  },
  {
    text: '$SYNE',
    value: contracts[chainId].syne_addr,
  },
];
