import AbstractObserver from '../utils/abstract-observer';
import dayjs from 'dayjs';

export default class Events extends AbstractObserver {
  constructor() {
    super();
    this._events = [];
    this._offers = [];
    this._destinations = new Map();
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  setDestinations(destinations) {
    destinations.forEach((destination) => this._destinations.set(destination.name, destination));
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }


  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        dateFrom: event.date_from !== null ? dayjs(event.date_from) : event.date_from,
        dateTo: event.date_to !== null ? dayjs(event.date_to) : event.date_to,
        basePrice: event.base_price,
        isFavorite: event.is_favorite,
      },
    );

    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      event,
      {
        'date_from': event.dateFrom.toISOString(),
        'date_to': event.dateTo.toISOString(),
        'base_price': event.basePrice,
        'is_favorite': event.isFavorite,
      },
    );

    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.basePrice;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
