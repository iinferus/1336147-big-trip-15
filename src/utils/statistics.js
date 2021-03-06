import {calculateDuration} from './events.js';

const countEventsByType = (events, type) =>
  events.filter((event) => event.type === type).length;
const sumCostEventByType = (events, type) =>
  events.filter((event) => event.type === type).reduce((sum, event) => sum + event.basePrice, 0);

const sumDurationEventsByType = (events, type) =>
  events.filter((event) => event.type === type)
    .reduce((sum, event) => sum + calculateDuration(event), 0);

export {countEventsByType, sumCostEventByType, sumDurationEventsByType};
