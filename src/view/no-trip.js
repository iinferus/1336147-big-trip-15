import AbstractView from './abstract';
import {NoEventMessage} from '../utils/const';

const createNoTripTemplate = (filter) => `<p class="trip-events__msg">${NoEventMessage[filter.toUpperCase()]}</p>`;

export default class TripFilter extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createNoTripTemplate(this._filter);
  }
}
