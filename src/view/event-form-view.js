const getTypes = (dataTypes) => {
  let typesTemplate = '';
  dataTypes.forEach((type) => {
    typesTemplate += `
    <div class="event__type-item">
      <input id="event-type-${type.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.type}">
      <label class="event__type-label  event__type-label--${type.type}" for="event-type-${type.type}-1">${type.type}</label>
    </div>`;
  });
  return typesTemplate;
};

const getEventType = (dataPoint, dataTypes) =>
  `<div class="event__type-wrapper">
  <label class="event__type  event__type-btn" for="event-type-toggle-1">
    <span class="visually-hidden">Choose event type</span>
    <img class="event__type-icon" width="17" height="17" src="img/icons/${dataPoint.type}.png" alt="Event type icon">
  </label>
  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${getTypes(dataTypes)}
    </fieldset>
  </div>
</div>`;

const getDestinationTemplate = (dataDestinations) => {
  let destinationTemplate = '';
  dataDestinations.forEach((destination) => {
    destinationTemplate += `
      <option value="${destination.name}"></option>
    `;
  });
  return destinationTemplate;
};

const getOffers = (dataPoint, dataTypes) => {
  let offersTemplate = '';
  const typeOfferArray = dataTypes
    .slice()
    .filter((typeOffer) => typeOffer.type === dataPoint.type);
  for (let i = 0; i < typeOfferArray.length; i++) {
    for (const offer in typeOfferArray[i].offers) {
      offersTemplate += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${typeOfferArray[i].offers[offer].title.split(' ').join('-')}" type="checkbox" name="event-offer-${typeOfferArray[i].offers[offer].title.split(' ').join('-')}">
      <label class="event__offer-label" for="event-offer-${typeOfferArray[i].offers[offer].title.split(' ').join('-')}">
        <span class="event__offer-title">${typeOfferArray[i].offers[offer].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${typeOfferArray[i].offers[offer].price}</span>
      </label>
    </div>
    `;
    }
  }
  return offersTemplate;
};

const getDestinationPhotos = (dataPoint, dataDestinations) => {
  let photosTemplate = '';
  const destinaitonArray = dataDestinations
    .slice()
    .filter((destinaiton) => destinaiton.name === dataPoint.destination);
  for (const destinaiton in destinaitonArray[0].pictures) {
    photosTemplate += `
      <img class="event__photo" src="${destinaitonArray[0].pictures[destinaiton].photo}" alt="${destinaitonArray[0].pictures[destinaiton].description}">
    `;
  }
  return [photosTemplate, destinaitonArray[0].description];
};

export const createEventForm = (
  dataPoint,
  dataTypes,
  dataDestinations,
  isCreate,
) => `
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    ${getEventType(dataPoint, dataTypes)}

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${dataPoint.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${dataPoint.destination}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${getDestinationTemplate(dataDestinations)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dataPoint.dateFrom.format('DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dataPoint.dateTo.format('DD/MM/YY HH:mm')}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${dataPoint.basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    ${isCreate ? '<button class="event__reset-btn" type="reset">Cancel</button>'
    : '<button class="event__reset-btn" type="reset">Delete</button><button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}
  </header>
  <section class="event__details">
    ${getOffers(dataPoint, dataTypes) !== '' ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
          ${getOffers(dataPoint, dataTypes)}
      </div>
    </section>` : '' }
    ${dataPoint.destinaiton ? '' : `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${getDestinationPhotos(dataPoint, dataDestinations)[1]}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${getDestinationPhotos(dataPoint, dataDestinations)[0]}
        </div>
      </div>

    </section>` }

  </section>
</form>
`;
