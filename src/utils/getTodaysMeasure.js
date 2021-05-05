import getDateOfMeasure from '../utils/getDateOfMeasure'

const getTodaysMeasure = (drink) => {
  const today = getDateOfMeasure()
  const lastDateOfMeasure = Math.max(...Object.keys(drink.history));
  if (today === lastDateOfMeasure) {
    return drink.history[lastDateOfMeasure];
  } else {
    return 0;
  }
};

export default getTodaysMeasure;
