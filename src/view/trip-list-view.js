import {getDurationDates} from '../utils.js';
import AbstractView from './abstract.js';

const getOffers = (trip) => {
  let offersTemplate = '';
  trip.forEach((offer) =>{
    offersTemplate += `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
  });
  return offersTemplate;
};

const getTitle = (trip) => {
  let pretextTitle = 'to';
  if (trip.type.includes('sightseeing') || trip.type.includes('restaurant')) {
    pretextTitle = 'in';
  }
  if (trip.type.includes('check-in')) {
    pretextTitle = 'at';
  }
  return pretextTitle;
};

const createEvent = (trip) => {
  const {dateFrom, dateTo, type, destination, basePrice, offers, isFavorite} = trip;
  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateFrom.format('YYYY-MM-DD')}">${dateFrom.format('MMM D')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${getTitle(trip)} ${destination}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom.format()}">${dateFrom.format('HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateTo.format()}">${dateTo.format('HH:mm')}</time>
    </p>
    <p class="event__duration">${getDurationDates(dateFrom, dateTo)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  ${offers.length > 0 ? `<h4 class="visually-hidden">Offers:</h4><ul class="event__selected-offers">
    ${getOffers(offers)}
  </ul>`: ''}
  <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>
`;};


export default class TripEvent extends AbstractView {
  constructor(trip) {
    super();
    this._trip = trip;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEvent(this._trip);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}

