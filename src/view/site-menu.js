import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-menu-item-name="${MenuItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" data-menu-item-name="${MenuItem.STATS}" href="#">Stats</a>
  </nav>`
);

class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItem(menuItem) {
    this.getElement()
      .querySelectorAll('.trip-tabs__btn')
      .forEach((element) => element.classList.remove('trip-tabs__btn--active'));

    const item = this.getElement().querySelector(`[data-menu-item-name=${menuItem}]`);

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItemName);
  }
}

export {SiteMenu as default};
