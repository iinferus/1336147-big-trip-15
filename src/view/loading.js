import AbstractView from './abstract.js';

const createLoadingTemplate = () => '<p class="trip-events__msg">Loading...</p>';

class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export {Loading as default};
