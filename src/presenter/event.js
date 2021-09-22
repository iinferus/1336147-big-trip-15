import TripEventView from '../view/event';
import EventFormView from '../view/event-edit';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class Event {
  constructor(eventListContainer, changeDate, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeDate;
    this._changeMode = changeMode;

    this._tripComponent = null;
    this._tripEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormCancel = this._handleFormCancel.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event, dataTypes, dataDestinations) {
    this._event = event;

    const prevTripComponent = this._tripComponent;
    const prevTripEditComponent = this._tripEditComponent;

    this._tripComponent = new TripEventView(event);
    this._tripEditComponent = new EventFormView(this._event, dataTypes, dataDestinations);

    this._tripComponent.setEditClickHandler(this._handleEditClick);
    this._tripComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEditComponent.setCancelClickHandler(this._handleFormCancel);
    this._tripEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevTripComponent === null || prevTripEditComponent === null) {
      render(this._eventListContainer, this._tripComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripComponent, prevTripComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEditComponent, prevTripEditComponent);
    }

    remove(prevTripComponent);
    remove(prevTripEditComponent);
  }

  destroy() {
    remove(this._tripComponent);
    remove(this._tripEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._tripEditComponent, this._tripComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._tripComponent, this._tripEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._tripEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._tripEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._tripComponent.shake(resetFormState);
        this._tripEditComponent.shake(resetFormState);
        break;
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._tripEditComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      event,
    );
    this._replaceFormToCard();
  }

  _handleFormCancel() {
    this._tripEditComponent.reset(this._event);
    this._replaceFormToCard();
  }

  _handleDeleteClick(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }
}
