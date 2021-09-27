import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const calculateDuration = (event) => event.dateTo - event.dateFrom;

const sortDay = (eventA, eventB) => eventA.dateFrom - eventB.dateFrom;
const sortDurationTime = (eventA, eventB) => calculateDuration(eventB) - calculateDuration(eventA);
const sortPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

export {sortDay, sortPrice, sortDurationTime};
