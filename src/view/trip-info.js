import AbstractView from './abstract';

const MAX_COUNT_DESTINATION = 3;

const createTripMainInfo = (events) => {
  if (events.length === 0) {
    return '<section class="trip-main__trip-info  trip-info"></section>';
  }
  const title = [];
  if (events.length <= MAX_COUNT_DESTINATION) {
    events.forEach((element) => {
      title.push(element.destination.name);
    });
  } else {
    title.push(events[0].destination.name);
    title.push('...');
    title.push(events[events.length - 1].destination.name);
  }
  let price = 0;
  events.forEach((event) => {
    price += Number(event.basePrice);
    for (const offer of Object.values(event.offers)) {
      price += Number(offer.price);
    }
  });
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title.join(' &mdash; ')}</h1>

      <p class="trip-info__dates">${events[0].dateFrom.format('D MMM')}&nbsp;&mdash;&nbsp;${events[events.length - 1].dateTo.format('D MMM')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>`;
};

class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripMainInfo(this._points);
  }
}

export {TripInfo as default};
