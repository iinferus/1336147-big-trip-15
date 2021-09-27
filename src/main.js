import SiteMenuView from './view/site-menu';
import NewEventButtonView from './view/new-event-button';
import EventBoardPresenter from './presenter/event-board';
import TripInfoPresenter from './presenter/trip-info';
import FiltersPresenter from './presenter/filters';
import StatisticsPresenter from './presenter/statistics';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import {RenderPosition, render} from './utils/render';
import {FilterType} from './utils/const';
import {sortDay} from './utils/task';
import {UpdateType, MenuItem} from './utils/const';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';
import {isOnline} from './utils/common.js';

const AUTHORIZATION = 'Basic kM4Kh4arSlrjo1s8i';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const StoreName = {
  EVENTS: `${STORE_PREFIX}-events-${STORE_VER}`,
  DESTINATIONS: `${STORE_PREFIX}-destinations-${STORE_VER}`,
  OFFERS: `${STORE_PREFIX}-offers-${STORE_VER}`,
};

const api = new Api(END_POINT, AUTHORIZATION);
const eventsStore = new Store(StoreName.EVENTS, window.localStorage);
const destinationsStore = new Store(StoreName.DESTINATIONS, window.localStorage);
const offersStore = new Store(StoreName.OFFERS, window.localStorage);
const apiWithProvider = new Provider(api, eventsStore, destinationsStore, offersStore);

const eventsModel = new EventsModel();
const filtersModel = new FiltersModel();

const pageBodyContainerElements = document.querySelectorAll('.page-body__container');
const tripMain = pageBodyContainerElements[0].querySelector('.trip-main');
const pageMainElement = pageBodyContainerElements[1];
const tripEvents = document.querySelector('.trip-events');
const tripNav = tripMain.querySelector('.trip-main__trip-controls');

const tripInfoPresenter = new TripInfoPresenter(tripMain, eventsModel);
const statisticsPresenter = new StatisticsPresenter(pageMainElement, eventsModel, pageBodyContainerElements);
const filtersPresenter = new FiltersPresenter(tripNav, filtersModel, eventsModel);
const boardPresenter = new EventBoardPresenter(tripEvents, eventsModel, filtersModel, apiWithProvider);

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
      if (!isOnline()) {
        toast('You can\'t create new task offline');
        siteMenuComponent.setMenuItem(MenuItem.TABLE);
        break;
      }
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

boardPresenter.init();

let isInitialData = false;

apiWithProvider.getInitialData()
  .then((results) => {
    const [destinations, offers] = results;
    eventsModel.setDestinations(destinations);
    eventsModel.setOffers(offers);
    isInitialData = true;
  })
  .then(() => apiWithProvider.getEvents())
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events.sort(sortDay));
    renderControls();
  })
  .catch(() => {
    if (isInitialData) {
      eventsModel.setEvents(UpdateType.INIT, []);
      renderControls(!isInitialData);
    } else {
      eventsModel.setEvents(UpdateType.INIT, []);
      renderControls(!isInitialData);
      toast('Error loading data');
    }
  });

tripInfoPresenter.init();
filtersPresenter.init();
boardPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
