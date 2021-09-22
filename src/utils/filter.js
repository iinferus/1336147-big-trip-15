import {FilterType} from './const.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => (event.dateFrom - Date.now()) >= 0),
  [FilterType.PAST]: (events) => events.filter((event) => (event.dateTo - Date.now()) < 0),
};
