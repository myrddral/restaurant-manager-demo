import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import getDateOfMeasure from "../utils/getDateOfMeasure";
import db from "../db";
// import TestForm from "./TestForm";

const NewItem = () => {
  const [drinks, setDrinks] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  // eslint-disable-next-line
  const [supplierID, setSupplierID] = useState("");
  const [unit, setUnit] = useState("üveg");
  const [volume, setVolume] = useState("");
  const [weightEmpty, setWeightEmpty] = useState("");
  const [weightFull, setWeightFull] = useState("");
  const [nexOrderingNumber, setNexOrderingNumber] = useState("");
  // eslint-disable-next-line
  const [totalAmount, setTotalAmount] = useState(0);
  const [dailyOrWeeklyMeasure, setDailyOrWeeklyMeasure] = useState(null)
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isFieldInValid, setIsFieldInvalid] = useState(false);
  const [validationError, setValidationError] = useState(
    "Add meg a termék nevét!"
  );

  useEffect(() => {
    db.collection("test_collection")
      .get()
      .then((data) => {
        const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDrinks(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [nexOrderingNumber]);

  const checkForExistingName = (name) => {
    let valid = true;
    drinks.forEach((drink) => {
      if (drink.name.includes(name)) {
        valid = false;
      }
    });
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //clear previous errors if any
    setValidationError("");

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!checkForExistingName(name)) {
      setValidationError("Ilyen nevű termék már van az adatbázisban!");
      setIsFieldInvalid(true);
      setValidated(true);
      return;
    }

    setValidated(true);

    const dateOfMeasure = getDateOfMeasure();

    //get the highest number of ordering
    const maxOrdering = drinks.reduce((prev, curr) =>
      prev.ordering > curr.ordering ? prev : curr
    ).ordering;

    setNexOrderingNumber(maxOrdering)

    // generate "new product" object to be submitted to DB
    const dataToSubmit = {
      name: name.replace(/ +(?= )/g, "").trim(),
      category: category,
      ordering: maxOrdering + 1,
      supplierID: supplierID.trim(),
      unit: unit.trim(),
      volume: Math.abs(volume.replace(/,/g, ".")),
      weightEmpty: weightEmpty.trim(),
      weightFull: weightFull.trim(),
      history: {
        [dateOfMeasure]: totalAmount,
      },
      measureFrequency: dailyOrWeeklyMeasure
    };

    db.collection("test_collection")
      .doc()
      .set(dataToSubmit)
      .then(() => {
        console.log("Document successfully written!");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    setIsPending(false);

    setValidated(true);
  };

  return (
    <>
      <h4 className="pt-4 pl-4">Új termék hozzáadása</h4>
      <Form
        className="p-4"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Form.Row>
          <Col>
            <Form.Group controlId="formBasicName">
              <Form.Label>Megnevezés</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                isInvalid={isFieldInValid}
              />
              <Form.Control.Feedback type="invalid">
                {validationError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Kategória</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Válassz...</option>
                <option value="bor">bor</option>
                <option value="whiskey">whiskey</option>
                <option value="gin">gin</option>
                <option value="rum">rum</option>
                <option value="digestif">digestif</option>
                <option value="pezsgő">pezsgő</option>
                <option value="champagne">champagne</option>
                <option value="tequila">tequila</option>
                <option value="konyak">konyak</option>
                <option value="aperitif">aperitif</option>
                <option value="vodka">vodka</option>
                <option value="sör">sör</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">Kötelező megadni!</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group controlId="formBasicVolume">
              <Form.Label>Űrtartalom (liter)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add meg a bontatlan üveg tartalmát (pl. 0.7)!"
                autoComplete="off"
                onChange={(e) => setVolume(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Add meg a bontatlan üveg tartalmát!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>Csomagolási egység</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value={unit}>üveg</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group controlId="formBasicWeightFull">
              <Form.Label>Bontatlan üveg súlya (gramm)</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                autoComplete="off"
                onChange={(e) => setWeightFull(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Add meg a bontatlan üveg súlyát!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicWeightEmpty">
              <Form.Label>Üres üveg súlya (gramm)</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                autoComplete="off"
                onChange={(e) => setWeightEmpty(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Add meg az üres üveg súlyát!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
          <Form.Group controlId="exampleForm.ControlSelect3">
              <Form.Label>Standolás gyakorisága</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setDailyOrWeeklyMeasure(e.target.value)}
                required
              >
                <option value="">Válassz...</option>
                <option value={dailyOrWeeklyMeasure}>heti</option>
                <option value={dailyOrWeeklyMeasure}>napi</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">Kötelező megadni!</Form.Control.Feedback>
            </Form.Group>
      </Col>
      <Col>
      </Col>
        </Form.Row>
        {/* <Form.Row>
          <Col>
            <Form.Group controlId="formBasicAmount">
              <Form.Label>Bontatlan üvegek száma (db)</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                // onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Add meg a bontatlan üvegek számát!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicAmount">
              <Form.Label>Bontott üveg tartalma</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Add meg a bontott üveg tartalmát, ha van!
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Form.Row> */}
        {/* <Form.Group controlId="formBasicSupplier">
          <Form.Label>Beszállító</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            onChange={(e) => setSupplierID(e.target.value)}
            required 
          />
        </Form.Group> */}

        {!isPending && (
          <Button variant="primary" type="submit" style={{ width: 90 }}>
            Felvétel
          </Button>
        )}
        {isPending && (
          <Button
            type="submit"
            id="submit-button-pending"
            disabled
            style={{ width: 90 }}
          >
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Button>
        )}
      </Form>
      <Alert variant="success" show={success}>
        A termék sikeresen bekerült az adatbázisba!
      </Alert>
    </>
  );
};

export default NewItem;
