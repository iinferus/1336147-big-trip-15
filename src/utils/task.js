import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

const sortDay = (taskA, taskB) => {
  const weight = getWeightForNullValue(taskA.dateFrom, taskB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskA.dateFrom).diff(dayjs(taskB.dateFrom));
};

const sortPrice = (taskA, taskB) => {
  const weight = getWeightForNullValue(taskA.basePrice, taskB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return taskA.basePrice < taskB.basePrice;
};

const sortDurationTime = (taskA, taskB) => {
  const diffA = taskA.dateTo.diff(taskA.dateFrom);
  const diffB = taskB.dateTo.diff(taskB.dateFrom);

  return diffB > diffA;
};

export {sortDay, sortPrice, sortDurationTime};
