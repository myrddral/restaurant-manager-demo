const getActualAmountFromWeight = (drink) => {
    const lastDateOfMeasure = Math.max(...Object.keys(drink.history));
    const lastMeasure = drink.history[lastDateOfMeasure];
    const netWeight = drink.weightFull - drink.weightEmpty;
    const ratio = drink.volume / netWeight;
    const actualAmount = lastMeasure * ratio;
    // console.log(`**********************************`);
    // console.log(`drink name: ${drink.name}`);
    // console.log(`last date of measure: ${lastDateOfMeasure}`);
    // console.log(`last measure: ${lastMeasure}`);
    // console.log(`netWeight: ${netWeight}`);
    // console.log(`ratio: ${ratio}`);
    // console.log(`actualAmount: ${actualAmount}`);
    return actualAmount.toFixed(2);
  };

  export default getActualAmountFromWeight;