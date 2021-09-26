import {getLeadingZero} from './common.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const calculateDuration = (event) => event.timeEnd - event.timeStart;
const calculateTimeSpend = (timeDifference) => {
  const countOfDay = dayjs.duration(timeDifference, 'millisecond').days();
  const countOfHour = dayjs.duration(timeDifference, 'millisecond').hours() % 24;
  const countOfMinutes = dayjs.duration(timeDifference, 'millisecond').minutes() % 60;
  return {countOfDay, countOfHour, countOfMinutes};
};
const humanizeTimeSpend = ({countOfDay, countOfHour, countOfMinutes}) => {
  if (countOfDay > 0) {
    return `${getLeadingZero(countOfDay)}D ${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  } else if (countOfHour > 0) {
    return `${getLeadingZero(countOfHour)}H ${getLeadingZero(countOfMinutes)}M`;
  }
  return `${getLeadingZero(countOfMinutes)}M`;
};

export {calculateDuration, calculateTimeSpend, humanizeTimeSpend};
