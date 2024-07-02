import { div, minus, multiple, plus } from '@client/libs/math';
import { getRemainingTime, getTotalTime } from '@client/utils/helper';

export const getVotingTurnout = (list: any[], totalBalance: string) => {
  let turnout = '0';
  for (let i = 0; i < list?.length; i++) {
    turnout = plus(turnout, multiple(div(list[i].power, totalBalance), '100'));
  }
  return turnout;
};

export const getTimeBarWidth = (startTime, endTime) => {
  const totalTime = getTotalTime(startTime, endTime);
  const remainingTime = getRemainingTime(startTime);
  return multiple(div(minus(totalTime, remainingTime), totalTime), '100');
};

export const checkNested = (obj, level) => {
  if (obj && Object.keys(obj)?.includes(level)) {
    return {
      status: true,
      value: obj[level]['percent'],
    };
  } else {
    if (obj) {
      const objKeys = Object.keys(obj);
      return checkNested(obj[objKeys[0]], level);
    }
  }
};

export const getQuorumValue = (obj, level) => {
  if (obj && Object.keys(obj)?.includes(level)) {
    return true;
  } else {
    if (obj) {
      const objKeys = Object.keys(obj);
      return checkNested(obj[objKeys[0]], level);
    }
  }
};
