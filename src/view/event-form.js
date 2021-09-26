import SmartView from './smart';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const getTypes = (dataPoint, dataTypes) => {
  let typesTemplate = '';
  dataTypes.forEach((type) => {
    typesTemplate += `
    <div class="event__type-item">
      <input id="event-type-${type.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.type}" ${dataPoint.type === type.type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type.type}" for="event-type-${type.type}-1">${type.type}</label>
    </div>`;
  });
  return typesTemplate;
};

const getEventType = (dataPoint, dataTypes, isDisabled) =>
  `<div class="event__type-wrapper">
  <label class="event__type  event__type-btn" for="event-type-toggle-1">
    <span class="visually-hidden">Choose event type</span>
    <img class="event__type-icon" width="17" height="17" src="img/icons/${dataPoint.type}.png" alt="Event type icon">
  </label>
  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${getTypes(dataPoint, dataTypes)}
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

const getOffers = (dataPoint, dataTypes, isCreate, isDisabled) => {
  let offersTemplate = '';
  const checkedOffers = [];
  dataPoint.offers.forEach((offer) => checkedOffers.push(offer.title));

  const currentType = (element) => {
    if(element.type === dataPoint.type) {
      element.offers.forEach((offer) => offersTemplate += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer${isCreate ? '' : `-${dataPoint.id}`}-${offer.title.split(' ').join('-')}" type="checkbox" name="event-offer${isCreate ? '' : `-${dataPoint.id}`}-${offer.title.split(' ').join('-')}" ${checkedOffers.indexOf(offer.title) !== -1 ? 'checked' : ''} data-title="${offer.title}" data-price="${offer.price}" ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer${isCreate ? '' : `-${dataPoint.id}`}-${offer.title.split(' ').join('-')}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `);
    }
  };

  dataTypes.find(currentType);
  return offersTemplate;
};

const createParagraphTemplate = (description) => `<p class="event__destination-description">${description}</p>`;
const createPhotoTemplate = ({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`;
const createPhotosTemplate = (photos) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photos.map(createPhotoTemplate).join('')}
    </div>
  </div>`
);
const createDestinationTemplate = ({description, pictures}, isDescription, isPhotos) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${(isDescription) ? createParagraphTemplate(description) : ''}

    ${(isPhotos) ? createPhotosTemplate(pictures) : ''}
  </section>`
);

const createEventForm = (
  dataPoint,
  dataTypes,
  dataDestinations,
  isCreate = false,
) => {
  const currentType = (element) => {
    if(element.type === dataPoint.type) {
      return element;
    }
  };
  const {
    id,
    type,
    dateFrom,
    dateTo,
    basePrice,
    destination,
    isDisabled,
    isSaving,
    isDeleting,
  } = dataPoint;

  const destinationName = destination ? destination.name : '';
  const destinationInfo =  dataDestinations.get(destinationName);
  const isDescription =  Boolean(destinationInfo && destinationInfo.description);
  const isPhotos =  Boolean(destinationInfo && destinationInfo.pictures && destinationInfo.pictures.length);
  const destionationTemplate = (isDescription || isPhotos) ? createDestinationTemplate(destinationInfo, isDescription, isPhotos) : '';

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    ${getEventType(dataPoint, dataTypes, isDisabled)}

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination${isCreate ? '' : `-${id}`}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${isCreate ? '' : `-${id}`}" type="text" name="event-destination" value="${destinationName}" autocomplete="on" list="destination-list${isCreate ? '' : `-${id}`}" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list${isCreate ? '' : `-${id}`}">
        ${getDestinationTemplate(dataDestinations)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFrom.format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTo.format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${isCreate ? '' : `-${id}`}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${isCreate ? '' : `-${id}`}" type="number" required name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit"${destinationName !== '' || isDisabled ? '' : 'disabled'}>${isSaving ? 'saving...' : 'save'}</button>
    ${isCreate ? '<button class="event__reset-btn" type="reset">Cancel</button>'
    : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'deleting...' : 'delete'}</button><button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`}
  </header>
  <section class="event__details">
    ${dataTypes.find(currentType) !== undefined && dataTypes.find(currentType).offers.length !== 0 ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
          ${getOffers(dataPoint, dataTypes, isCreate, isDisabled)}
      </div>
    </section>` : '' }
    ${destionationTemplate}
  </section>
</form>
</li>`;};

class EventForm extends SmartView {
  constructor(event, dataTypes, dataDestinations, isCreate = false) {
    super();
    this._event = event;
    this._isCreate = isCreate;
    this._dataTypes = dataTypes;
    this._dataDestinations = dataDestinations;
    this._data = EventForm.parseEventToData(this._event);
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _setDatepicker() {
    const commonSettings = {
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    if (this._datepickerStart && this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerStart = flatpickr(
      this.getElement().querySelector(`#event-start-time-${this._event.id}`),
      Object.assign(
        commonSettings,
        {
          defaultDate: new Date(this._data.dateFrom),
          onChange: this._dateFromChangeHandler,
          maxDate: new Date(this._data.dateTo),
        }),
    );

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector(`#event-end-time-${this._event.id}`),
      Object.assign(
        commonSettings,
        {
          defaultDate: new Date(this._data.dateTo),
          onChange: this._dateToChangeHandler,
          minDate: new Date(this._data.dateFrom),
          maxDate: null,
        }),
    );
  }

  reset(event) {
    this.updateData(
      EventForm.parseEventToData(event),
    );
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  getTemplate() {
    return createEventForm(this._data, this._dataTypes, this._dataDestinations, this._isCreate);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelClickHandler(this._callback.cancelClick);
    this._setDatepicker();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationInputHandler);
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._typeChangeHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceInputHandler);
    this.getElement()
      .querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox) => {
        checkbox.addEventListener('change', this._offersChangeHandler);
      });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: this._dataDestinations.get(evt.currentTarget.value),
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
    evt.target;
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    const checkboxElements = this.getElement().querySelectorAll('.event__offer-checkbox');
    const offers = [];
    checkboxElements.forEach((checkbox) => {
      if(checkbox.checked) {
        offers.push({
          title: checkbox.dataset.title,
          price: + checkbox.dataset.price,
        });
      }
    });
    this.updateData(
      {
        offers,
      });
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: dayjs(userDate),
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: dayjs(userDate),
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: +evt.target.value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseDataToEvent(this._data));
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    if (!this._isCreate) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._cancelClickHandler);
    }
  }

  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        isOffers: event.offers !== null,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    if (!data.isOffers) {
      data.offers = null;
    }

    delete data.isOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}

export {EventForm as default};
