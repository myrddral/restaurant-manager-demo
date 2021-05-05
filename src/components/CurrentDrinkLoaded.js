import { Button, Form } from "react-bootstrap";
// import getTodaysMeasure from "../utils/getTodaysMeasure";
import getDateOfMeasure from "../utils/getDateOfMeasure";
import amountInLiter from "../utils/amountInLiter";
import db from "../db";
import { useState } from "react";

const CurrentDrinkLoaded = (props) => {
  const drink = props.drink;
  const currentMeasure = props.currentMeasure;
  const [numberOfFullBottles, setNumberOfFullBottles] = useState(0);


  // currently this goes to negative until it reaches the empty bottles weight
  // need to get the stabilized byte and hide the result before stopping on a stabilized value
  const totalAmountInGrams = () => {
    const netWeight = drink.weightFull - drink.weightEmpty;
    const fullBottlesWeight = numberOfFullBottles * netWeight;
    const totalAmount = fullBottlesWeight + currentMeasure;
    if (currentMeasure === 0) {
      return fullBottlesWeight;
    } else {
      return totalAmount - drink.weightEmpty;
    }
  };

  const handleSaveClick = () => {
    //pre-calcualate key based on today's date
    const keyToUpdate = `history.${getDateOfMeasure()}`;
    db.collection("test_collection")
      .doc(`${drink.id}`)
      .update({
        [keyToUpdate]: `${totalAmountInGrams()}`,
      })
      .then(() => {
        console.log("Document successfully updated!");
        props.setIsSubmitted(true);
      });
  };

  props.setIsSubmitted(false);

  return (
    <>
      {!drink && <p>Válassz ki egy italt a kezdéshez!</p>}
      {drink && (
        <>
          <div className="currentMeasureDisplay" style={{ fontSize: 60 }}>
            <strong>{amountInLiter(totalAmountInGrams(), drink)} </strong>
            <small>liter</small>
          </div>
          {/* <div>{totalAmountInGrams()} g</div> */}
          <p>
            Termék neve: <strong>{drink.name}</strong>
          </p>
          <p>
            Termék kategóriája: <strong>{drink.category}</strong>
          </p>
          <p>
            Bontantlan üvegek száma{" "}
            <Form.Control
              type="number"
              value={numberOfFullBottles}
              onChange={(e) => setNumberOfFullBottles(e.target.value)}
              style={{ textAlign: "center" }}
            />
          </p>
          <Button variant="success" onClick={handleSaveClick}>
            Mentés
          </Button>
        </>
      )}
    </>
  );
};

export default CurrentDrinkLoaded;
