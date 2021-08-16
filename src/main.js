import TripMain from './view/trip-main.js';
import TripMenu from './view/menu-view.js';
import TripEventsListView from './view/trip-events.js';
import TripFilter from './view/filter-view.js';
import TripSortView from './view/sort-view.js';
import TripEventView from './view/trip-list-view.js';
import EventFormView from './view/event-form-view.js';
import {createPoints} from './mock/point-mock.js';
import {RenderPosition, renderElement} from './utils.js';

const sortedPoints = createPoints.sort((a, b) => {
  if (a.dateFrom.diff(b.dateFrom) > 1) {
    return 1;
  }
  if (a.dateFrom.diff(b.dateFrom) < 1) {
    return -1;
  }
  return 0;
});

const renderTripEvent = (tripListElement, trip) => {
  const tripComponent = new TripEventView(trip);
  const tripEditComponent = new EventFormView(trip);

  const replaceCardToForm = () => {
    tripListElement.replaceChild(tripEditComponent.getElement(), tripComponent.getElement());
  };

  const replaceFormToCard = () => {
    tripListElement.replaceChild(tripComponent.getElement(), tripEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  tripComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  tripEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  tripEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  renderElement(tripListElement, tripComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripMenu = tripMain.querySelector('.trip-controls__navigation');
const tripFilter = tripMain.querySelector('.trip-controls__filters');

const tripList = new TripEventsListView().getElement();
renderElement(tripMain, new TripMain(sortedPoints).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripMenu, new TripMenu().getElement(), RenderPosition.BEFOREEND);
renderElement(tripFilter, new TripFilter().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEvents, tripList, RenderPosition.BEFOREEND);
renderElement(tripEvents, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);

sortedPoints.forEach((trip) => {
  renderTripEvent(tripList, trip);
});
