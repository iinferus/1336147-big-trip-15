const getLeadingZero = (number) => (number < 10) ? `0${number}` : `${number}`;

const isOnline = () => window.navigator.onLine;

export {getLeadingZero, isOnline};
