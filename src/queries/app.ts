import { atom } from 'recoil';
import { last } from 'ramda';

export const priceKeyIndexState = atom({
  key: 'priceKeyIndex',
  default: 0,
});

export const iterateAllPage = async <T, Offset>(
  query: (offset?: Offset) => Promise<T[]>,
  nextOffset: (item?: T) => Offset | undefined,
  limit: number,
) => {
  const iterate = async (acc: T[], offset?: any): Promise<T[]> => {
    const data = await query(offset);
    const done = data.length < limit;
    const next = [...acc, ...data];
    return done ? next : await iterate(next, nextOffset(last(data)));
  };

  return await iterate([]);
};
