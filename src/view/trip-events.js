import {createElement} from '../utils.js';

const createTripEventsList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class TripEventsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsList(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}