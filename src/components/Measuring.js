// import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import MeasuringTable from "./MeasuringTable";
import { Button, Modal, Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import CurrentDrinkLoaded from "./CurrentDrinkLoaded";
import Scale from "./Scale";
import SendReport from "./SendReport";
import db from "../db";

const Measuring = () => {
  const [drinks, setDrinks] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [currentDrink, setCurrentDrink] = useState(null);
  const [currentMeasure, setCurrentMeasure] = useState(null);
  const [isScaleConnected, setIsScaleConnected] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [drinkTypeListed, setDrinkTypeListed] = useState(null);
  const [measureFrequency, setMeasureFrequency] = useState("napi");
  let match = useRouteMatch();

  const [show, setShow] = useState(false);
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  useEffect(() => {
    const fetchWines = () => {
      db.collection("test_collection")
        .where("category", "==", "bor")
        .where("measureFrequency", "==", `${measureFrequency}`)
        .get()
        .then((data) => {
          const result = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDrinks(result);
          setIsPending(false);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const fetchSpirits = () => {
      db.collection("test_collection")
        .where("category", "!=", "bor")
        .where("measureFrequency", "==", `${measureFrequency}`)
        .orderBy("category")
        .get()
        .then((data) => {
          const result = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDrinks(result);
          setIsPending(false);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    if (match.url === "/measure-wine") {
      fetchWines();
      setDrinkTypeListed("bor");
    } else if (match.url === "/measure-spirit") {
      fetchSpirits();
      setDrinkTypeListed("spirit");
    }
  }, [isSubmitted, match.url, measureFrequency]);

  // eslint-disable-next-line
  const showModalOnClick = (e) => {
    drinks.forEach((drink) => {
      if (drink.name === e.target.textContent) {
        setCurrentDrink(drink);
        handleShowModal();
      }
    });
  };

  const saveMeasure = () => {
    console.log("mentés");
  };

  const loadingAnimation = (
    <div className="d-flex justify-content-center" style={{ paddingTop: 100 }}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );

  return (
    <>
      {isPending ? (
        loadingAnimation
      ) : (
        <div className="d-flex p-4 justify-content-center">
          <div
            className="mr-4 w-50"
            style={{
              border: "2px solid black",
              borderRadius: 10,
              height: 400,
              maxWidth: 420,
            }}
          >
            <div className="d-flex align-items-center flex-column mt-5">
              {isScaleConnected && (
                <CurrentDrinkLoaded
                  drink={currentDrink}
                  currentMeasure={currentMeasure}
                  setIsSubmitted={setIsSubmitted}
                />
              )}
            </div>
            <div className="p-4">
              <Scale
                setCurrentMeasure={setCurrentMeasure}
                setIsScaleConnected={setIsScaleConnected}
              />
            </div>
          </div>
          <Container>
            <Row></Row>
            <Row>
              <Col className="mb-2">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={measureFrequency}
                  onSelect={(k) => setMeasureFrequency(k)}
                  transition={false} //check if enabled still creates an error with findDOMNode
                >
                  <Tab eventKey="napi" title="Napi stand">
                    <MeasuringTable
                      drinks={drinks}
                      setCurrentDrink={setCurrentDrink}
                    />
                  </Tab>
                  <Tab eventKey="heti" title="Heti stand">
                    <MeasuringTable
                      drinks={drinks}
                      setCurrentDrink={setCurrentDrink}
                    />
                  </Tab>
                  <Tab eventKey="report" title="Riport">
                    <Col className="pt-2">
                      <SendReport
                        drinks={drinks}
                        drinkTypeListed={drinkTypeListed}
                        measureFrequency={measureFrequency}
                      />
                    </Col>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
            <Row>
              <Col></Col>
            </Row>
          </Container>
        </div>
      )}
      {currentDrink && (
        <>
          <Modal
            show={show}
            onHide={handleCloseModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{currentDrink.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Scale />
              <div className="d-flex justify-content-center p-2">
                <p>Kategória: {currentDrink.category}</p>
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <Button variant="warning" onClick={handleCloseModal}>
                Mégsem
              </Button>
              <Button variant="success" onClick={saveMeasure}>
                Mentés
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default Measuring;
