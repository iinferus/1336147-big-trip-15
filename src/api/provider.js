import EventsModel from '../model/events.js';
import {isOnline} from '../utils/common.js';

const getSyncedEvents = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});

export default class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((points) => {
          const items = createStoreStructure(points.map(EventsModel.adaptToServer));
          this._eventsStore.setItems(items);
          return points;
        });
    }

    const storeEvents = Object.values(this._eventsStore.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updateEvent(point) {
    if (isOnline()) {
      return this._api.updateEvent(point)
        .then((updatedPoint) => {
          this._eventsStore.setItem(updatedPoint.id, EventsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._eventsStore.setItem(point.id, EventsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addEvent(point) {
    if (isOnline()) {
      return this._api.addEvent(point)
        .then((newPoint) => {
          this._eventsStore.setItem(newPoint.id, EventsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deleteEvent(point) {
    if (isOnline()) {
      return this._api.deleteEvent(point)
        .then(() => this._eventsStore.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  getInitialData() {
    if(isOnline()) {
      return this._api.getInitialData()
        .then((results) => {
          const [destinations, offers] = results;
          this._destinationsStore.setItems(destinations);
          this._offersStore.setItems(offers);
          return results;
        });
    }

    const storeDestinations = this._destinationsStore.getItems();
    const storeOffers = this._offersStore.getItems();
    return Promise.resolve([storeDestinations, storeOffers]);
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._eventsStore.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
