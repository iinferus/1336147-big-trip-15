import dayjs from 'dayjs';

export const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const NoEventMessage = {
  EVERYTHING: 'Click New Event to create your first event',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  RESET: 'RESET',
};

export const BLANK_EVENT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs().add(1, 'day'),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  offers: [],
  type: 'taxi',
  isFavorite: false,
};

export const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future',
};

export const MenuItem = {
  ADD_NEW_EVENT: 'ADD_NEW_EVENT',
  TABLE: 'TABLE',
  STATS: 'STATS',
};
