import {getRandomInteger, getRandomArrayElement} from '../utils.js';

const TYPE_LIBRARY = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const OFFER_TITLE = ['Upgrade to a business class', 'Add luggage', 'Switch to comfort class', 'Add meal', 'Choose seats', 'Travel by train', 'Choose the radio station'];

const generateOffer = () => ({
  title: getRandomArrayElement(OFFER_TITLE),
  price: getRandomInteger(10, 500),
});

const generateOffers = () => {
  const offersArray = [];
  for (const typeIndex in TYPE_LIBRARY) {
    offersArray.push({
      type: TYPE_LIBRARY[typeIndex],
      offers: new Array(getRandomInteger(0, 5)).fill().map(() => generateOffer()),
    });
  }
  return offersArray;
};

export {generateOffers};
