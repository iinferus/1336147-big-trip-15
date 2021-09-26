import dayjs from 'dayjs';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const NoEventMessage = {
  EVERYTHING: 'Click New Event to create your first event',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  RESET: 'RESET',
};

const BLANK_EVENT = {
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

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future',
};

const MenuItem = {
  ADD_NEW_EVENT: 'ADD_NEW_EVENT',
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export {EVENT_TYPES, SortType, NoEventMessage, UserAction, UpdateType,BLANK_EVENT, FilterType, MenuItem};
