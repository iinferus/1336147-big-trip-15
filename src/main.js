import {createTripMainInfo} from './view/trip-main.js';
import {createTripMenu} from './view/menu-view.js';
import {createTripFilter} from './view/filter-view.js';
import {createTripSort} from './view/sort-view.js';
import {createEvent} from './view/trip-list-view.js';
import {createEventForm} from './view/event-form-view.js';
import {sorted} from './mock/point-mock.js';
import {generateOffers} from './mock/offer-mock.js';
import {genereateDestinations} from './mock/destination-mock.js';

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripMenu = tripMain.querySelector('.trip-controls__navigation');
const tripFilter = tripMain.querySelector('.trip-controls__filters');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMain, createTripMainInfo(sorted), 'afterbegin');
render(tripMenu, createTripMenu(), 'beforeend');
render(tripFilter, createTripFilter(), 'beforeend');
render(tripEvents, createTripSort(), 'beforeend');

const tripList = tripEvents.querySelector('.trip-events__list');

sorted.forEach((element) => {
  render(tripList, createEvent(element), 'beforeend');
});

render(tripList, createEventForm(sorted[0],generateOffers(),genereateDestinations(),false), 'afterbegin');
