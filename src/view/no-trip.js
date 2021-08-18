import AbstractView from './abstract.js';

const createNoTripTemplate = () => (
  `<p class="trip-events__msg">
    Click New Event to create your first point
  </p>`
);

export default class TripFilter extends AbstractView {
  getTemplate() {
    return createNoTripTemplate();
  }
}
