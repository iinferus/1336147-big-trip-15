import {getDurationDates} from '../utils.js';

const getOffers = (data) => {
  let offersTemplate = '';
  for (const offer in data) {
    offersTemplate += `
    <li class="event__offer">
      <span class="event__offer-title">${data[offer].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${data[offer].price}</span>
    </li>`;
  }
  return offersTemplate;
};

export const createEvent = (data) => (`
<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${data.dateFrom.format('YYYY-MM-DD')}">${
    data.dateFrom.format('MMM D')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${data.type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${data.type} ${data.destination}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${data.dateFrom.format()}">${data.dateFrom.format('HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${data.dateTo.format()}">${data.dateTo.format('HH:mm')}</time>
    </p>
    <p class="event__duration">${getDurationDates(data.dateFrom, data.dateTo)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${data.basePrice}</span>
  </p>
  ${data.offers.length > 0 ? `<h4 class="visually-hidden">Offers:</h4><ul class="event__selected-offers">
    ${getOffers(data.offers)}
  </ul>`: ''}
  <button class="event__favorite-btn event__favorite-btn${data.isFavorite ? '--active' : ''}" type="button">
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
`);
