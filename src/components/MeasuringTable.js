import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import editIcon from "../assets/edit-icon.svg";
import getTodaysMeasure from "../utils/getTodaysMeasure";
import amountInLiter from "../utils/amountInLiter";
import { Form, Image } from "react-bootstrap";
import db from "../db";

const MeasuringTable = (props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const drinks = props.drinks;

  const handleEditClick = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  };

  const handleClickOnDrink = (drink) => {
    props.setCurrentDrink(drink);
  };

  const handleOnChange = () => {
    // setOrder(e.target.value)
  };

  const handleDelete = (id) => {
    db.collection("test_collection")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        alert("Termék törölve az adatbázisból!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <>
      <div style={{ minWidth: 455, height: "78vh", overflowY: "auto" }}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {/* <th>
                Sorrend
              </th> */}
              <th>
                Megnevezés
                <Image
                  src={editIcon}
                  className="ml-2"
                  variant="outline-primary"
                  size="sm"
                  onClick={handleEditClick}
                  style={{ cursor: "pionter" }}
                ></Image>
              </th>
              <th>Kategória</th>
              <th>Mai mérés (liter)</th>
              {isEditMode && <th>Termék törlése</th>}
            </tr>
          </thead>
          <tbody>
            {drinks.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4">Nincs termék az adatbázisban!</td>
              </tr>
            )}
            {drinks &&
              drinks.map((drink) => (
                <tr
                  key={drink.id}
                  onClick={() => handleClickOnDrink(drink)}
                  style={{ cursor: "pointer" }}
                >
                  {/* {isEditMode ? (
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        value={drink.ordering}
                        onChange={(e) => handleOnChange}
                      />
                    </td>
                  ) : (
                    <td>{drink.ordering}</td>
                  )} */}
                  <td>{drink.name}</td>
                  <td>{drink.category}</td>
                  <td>{amountInLiter(getTodaysMeasure(drink), drink)}</td>
                  {isEditMode && (
                    <td style={{ padding: 5 }}>
                      <Button
                        variant="danger"
                        className="w-100"
                        size="sm"
                        onClick={() => handleDelete(drink.id)}
                      >
                        Törlés
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default MeasuringTable;
