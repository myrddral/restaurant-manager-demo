import getDateOfMeasure from "../utils/getDateOfMeasure";

const getPreviousDaysMeasure = (drink) => {
  const today = getDateOfMeasure();
  const lastDateOfMeasure = Math.max(...Object.keys(drink.history));
  if (today === lastDateOfMeasure && drink.history[lastDateOfMeasure-1] !== undefined) {
    return drink.history[lastDateOfMeasure-1];
  } else {
    return drink.history[lastDateOfMeasure];
  }
};

export default getPreviousDaysMeasure;
