import {createTripMainInfo} from './view/trip-main.js';
import {createTripMenu} from './view/menu-view.js';
import {createTripFilter} from './view/filter-view.js';
import {createTripSort} from './view/sort-view.js';
import {createEvent} from './view/trip-list-view.js';
import {createEventForm} from './view/event-form-view.js';

const EVENT_COUNT = 3;

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripMenu = tripMain.querySelector('.trip-controls__navigation');
const tripFilter = tripMain.querySelector('.trip-controls__filters');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMain, createTripMainInfo(), 'afterbegin');
render(tripMenu, createTripMenu(), 'beforeend');
render(tripFilter, createTripFilter(), 'beforeend');
render(tripEvents, createTripSort(), 'beforeend');

const tripList = tripEvents.querySelector('.trip-events__list');

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripList, createEvent(), 'beforeend');
}

render(tripList, createEventForm(false), 'afterbegin');
