import TripInfoView from '../view/trip-info';
import { UpdateType } from '../utils/const';
import {RenderPosition, render, remove} from '../utils/render';

export default class TripInfo {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this._clearInfo();
        this._render();
        break;
      case UpdateType.MAJOR:
        this._clearInfo();
        this._render();
        break;
    }
  }

  _render() {
    this._infoElement = new TripInfoView(this._eventsModel.getEvents());
    render(this._container, this._infoElement, RenderPosition.AFTERBEGIN);
  }

  _clearInfo() {
    remove(this._infoElement);
  }

  init() {
    this._render();
  }
}
