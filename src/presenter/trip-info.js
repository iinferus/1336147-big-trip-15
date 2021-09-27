import TripInfoView from '../view/trip-info';
import { UpdateType } from '../utils/const';
import {RenderPosition, render, remove} from '../utils/render';

class TripInfo {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    remove(this._tripInfoComponent);
    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());
    render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.MINOR
      || updateType === UpdateType.MAJOR
      || updateType === UpdateType.RESET
      || updateType === UpdateType.INIT) {
      this.init();
    }
  }
}

export {TripInfo as default};
