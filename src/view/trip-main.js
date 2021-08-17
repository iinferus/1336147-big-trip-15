import {createElement} from '../utils.js';

const MAX_COUNT_DESTINATION = 3;

const createTripMainInfo = (data) => {
  const title = [];
  if (data.length <= MAX_COUNT_DESTINATION) {
    data.forEach((element) => {
      title.push(element.destination);
    });
  } else {
    title.push(data[0].destination);
    title.push('...');
    title.push(data[data.length - 1].destination);
  }
  let price = 0;
  for (let i = 0; i < data.length; i++) {
    price += data[i].basePrice;
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${data[0].dateFrom.format('D MMM')}&nbsp;&mdash;&nbsp;${data[data.length - 1].dateTo.format('D MMM')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>`;
};

export default class TripMain {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripMainInfo(this._points);
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
