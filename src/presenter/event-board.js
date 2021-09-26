import TripEventsListView from '../view/trip-events';
import TripSortView from '../view/trip-sort';
import EventPresenter, {State as EventPresenterViewState} from './event';
import EventNewPresenter from './event-new';
import NoTripView from '../view/no-trip';
import LoadingView from '../view/loading';
import {RenderPosition, render, remove} from '../utils/render';
import {sortDay, sortPrice, sortDurationTime} from '../utils/task';
import {FilterType, SortType, UserAction, UpdateType} from '../utils/const';
import {filter} from '../utils/filter';

class EventBoard {
  constructor(boardContainer, eventsModel, filtersModel, api) {
    this._boardContainer = boardContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._dataTypes = this._getOffers();
    this._dataDestinations = this._getDestinations();
    this._eventPresenter = new Map();
    this._sortComponent = null;
    this._noEventComponent = null;
    this._loadingComponent = new LoadingView();
    this._isLoading = true;
    this._api = api;

    this._filterType = FilterType.EVERYTHING;
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._listComponent = new TripEventsListView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._listComponent, this._handleViewAction, this._dataTypes, this._dataDestinations);
  }

  init() {
    this._renderBoard();
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearBoard(true);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._eventNewPresenter = new EventNewPresenter(this._listComponent, this._handleViewAction, this._dataTypes, this._dataDestinations);
    this._currentSortType = SortType.DAY;
    this._eventNewPresenter.init(callback);
    if (this._getEvents().length === 0) {
      this._renderEventsList();
    }
  }

  _getEvents() {
    this._filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[this._filterType](events);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredEvents.sort(sortPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortDurationTime);
    }
    return filteredEvents.sort(sortDay);
  }

  _getDestinations() {
    return this._eventsModel.getDestinations();
  }

  _getOffers() {
    return this._eventsModel.getOffers().slice();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    if (this._currentSortType === undefined) {
      this._currentSortType = 'day';
    }

    this._sortComponent = new TripSortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard(true);
        this._renderBoard();
        break;
      case UpdateType.RESET:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._dataTypes = this._getOffers();
        this._dataDestinations = this._getDestinations();
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    this._eventPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._listComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event, this._dataTypes, this._dataDestinations);
    this._eventPresenter.set(event.id, eventPresenter);
  }

  _renderEvents() {
    this._getEvents()
      .slice()
      .forEach((trip) => this._renderEvent(trip));
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvent() {
    this._noEventComponent = new NoTripView(this._filterType);
    render(this._boardContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    this._renderEvents();
    render(this._boardContainer, this._listComponent, RenderPosition.BEFOREEND);
  }

  _clearEventsList() {
    this._eventPresenter.forEach((presenter) => presenter.destroy());
    this._eventPresenter.clear();
  }

  _clearBoard(resetSortType = false) {
    this._eventNewPresenter.destroy();
    this._clearEventsList();
    remove(this._sortComponent);
    remove(this._noEventComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderSort();
    this._renderEventsList();
  }
}

export {EventBoard as default};
