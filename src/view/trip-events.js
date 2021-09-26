import AbstractView from './abstract';

const createTripEventsList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class TripEventsList extends AbstractView {
  getTemplate() {
    return createTripEventsList();
  }
}

export {TripEventsList as default};
