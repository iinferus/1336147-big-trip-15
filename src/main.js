import SiteMenuView from './view/site-menu';
import NewEventButtonView from './view/new-event-btn';
import EventBoardPresenter from './presenter/event-board';
import TripInfoPresenter from './presenter/trip-info';
import FiltersPresenter from './presenter/filter';
import StatisticsPresenter from './presenter/statistics';
import EventsModel from './model/events';
import FiltersModel from './model/filter';
import {RenderPosition, render} from './utils/render';
import {FilterType} from './utils/const';
import {sortDay} from './utils/task';
import {UpdateType, MenuItem} from './utils/const';
import Api from './api.js';

const AUTHORIZATION = 'Basic kM4Kh4arSlrjo1s8i';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filtersModel = new FiltersModel();

api.getDestinations().then((destinations) => {
  eventsModel.setDestinations(destinations);
});

api.getOffers().then((offers) => {
  eventsModel.setOffers(offers);
});

const pageBodyContainerElements = document.querySelectorAll('.page-body__container');
const tripMain = pageBodyContainerElements[0].querySelector('.trip-main');
const pageMainElement = pageBodyContainerElements[1];
const tripEvents = document.querySelector('.trip-events');
const tripNav = tripMain.querySelector('.trip-main__trip-controls');

const tripInfoPresenter = new TripInfoPresenter(tripMain, eventsModel);
const statisticsPresenter = new StatisticsPresenter(pageMainElement, eventsModel, pageBodyContainerElements);
const filtersPresenter = new FiltersPresenter(tripNav, filtersModel, eventsModel);
const boardPresenter = new EventBoardPresenter(tripEvents, eventsModel, filtersModel, api);

const siteMenuComponent = new SiteMenuView();
const newEventButtonComponent = new NewEventButtonView();

const handleNewEventFormClose = () => {
  newEventButtonComponent.getElement().disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      statisticsPresenter.destroy();
      boardPresenter.destroy();
      filtersModel.setFilter(UpdateType.RESET, FilterType.EVERYTHING);
      boardPresenter.init();
      boardPresenter.createEvent(handleNewEventFormClose);
      newEventButtonComponent.getElement().disabled = true;
      filtersPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      boardPresenter.init();
      filtersPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      statisticsPresenter.init();
      filtersPresenter.init(true);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const renderControls = (isDisabledNewButton) => {
  newEventButtonComponent.setDisabledState(isDisabledNewButton);
  render(tripNav, siteMenuComponent, RenderPosition.BEFOREEND);
  render(tripMain, newEventButtonComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  newEventButtonComponent.setMenuClickHandler(handleSiteMenuClick);
};

api.getDestinations()
  .then((destinations) => {
    eventsModel.setDestinations(destinations);
  })
  .then(() => api.getOffers())
  .then((offers) => {
    eventsModel.setOffers(offers);
  })
  .then(() => api.getEvents())
  .then((events) => {
    boardPresenter.init();
    eventsModel.setEvents(UpdateType.INIT, events.sort(sortDay));
    tripInfoPresenter.init();
    filtersPresenter.init();
    renderControls();
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });
