import AbstractView from './abstract';
import { SortType } from '../utils/const';

const createSortsRadio = (currentSortType) => {
  let sortsTemplate = '';
  for (const value of Object.values(SortType)) {
    sortsTemplate += `
    <div class="trip-sort__item  trip-sort__item--${value}">
      <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}" ${value === currentSortType ? 'checked' : ''} >
      <label class="trip-sort__btn" for="sort-${value}" data-sort-type="${value}">${value}</label>
    </div>`;
  }
  return sortsTemplate;
};

const createTripSort = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${createSortsRadio(currentSortType)}
</form>`
);

export default class TripSort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSort(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
