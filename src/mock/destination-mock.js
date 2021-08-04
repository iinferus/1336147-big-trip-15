import {getRandomInteger, getRandomMultipleArrayElement} from '../utils.js';

const CITY_LIBRARY = ['Tokyo','Wellington', 'Canberra', 'Toronto', 'Oslo'];

const DESCRIPTION_LIBRARY = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Cras aliquet varius magna, non porta ligula feugiat eget.','Fusce tristique felis at fermentum pharetra.','Aliquam id orci ut lectus varius viverra.','Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.','Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.','Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.','Sed sed nisi sed augue convallis suscipit in sed felis.','Aliquam erat volutpat.','Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const generatePictures = () => ({
  photo: `http://picsum.photos/248/152?${getRandomInteger(0,100)}`,
  description: Object.values(getRandomMultipleArrayElement(DESCRIPTION_LIBRARY)).join(' '),
});


const genereateDestinations = () => {
  const destinationArray = [];
  for (const cityIndex in CITY_LIBRARY) {
    destinationArray.push({
      name: CITY_LIBRARY[cityIndex],
      description: Object.values(getRandomMultipleArrayElement(DESCRIPTION_LIBRARY)).join(' '),
      pictures: new Array(getRandomInteger(1, 5)).fill().map(() => generatePictures()),
    });
  }
  return destinationArray;
};

export {genereateDestinations};
