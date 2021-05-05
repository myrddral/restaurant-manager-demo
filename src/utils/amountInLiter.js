const amountInLiter = (amountInGrams, drink) => {
  const netWeight = drink.weightFull - drink.weightEmpty;
  const ratio = drink.volume / netWeight;
  const totalAmount = amountInGrams * ratio;
  return totalAmount.toFixed(2);
};

export default amountInLiter;
