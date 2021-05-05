  //generate todays date in YYYMMDD format to be used as object key for drink history

const getTodaysDateYYYYMMDD = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  today = parseInt(yyyy + mm + dd);
  return today;
};

export default getTodaysDateYYYYMMDD;
