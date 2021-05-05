import getTodaysDateYYYYMMDD from './getTodaysDate'

// if the time of measure is between 00.00 and 05.00, decrement value by 1
const getDateOfMeasure = () => {
    const actualDate = new Date();
    const actualHour = actualDate.getHours();
    if (actualHour >= 0 && actualHour <= 5) {
      return getTodaysDateYYYYMMDD() - 1;
    } else {
      return getTodaysDateYYYYMMDD();
    }
  };

export default getDateOfMeasure