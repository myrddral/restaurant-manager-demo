import { useEffect, useState } from "react";
import db from "../db";
import Table from "react-bootstrap/Table";
import getActualAmountFromWeight from "../utils/getActualVolumeFromWeight";

const Main = () => {
  const [drinks, setDrinks] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    db.collection("test_collection")
      .get()
      .then((data) => {
        const result = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDrinks(result);
        setIsPending(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  

  return (
    <>
      {/* <div className="d-flex justify-content-end">
        <Button
          className="m-2"
          variant="outline-primary"
          size="sm"
          onClick={handleClickCSV}
        >
          Letöltés CSV-ben
        </Button>
        <Button
          className="m-2"
          variant="outline-primary"
          size="sm"
          onClick={handleClickReport}
          disabled={isReportPending}
        >
          Riport küldése
        </Button>
      </div> */}
      {!isPending && (
        <div className="tablecontainer pl-3 pr-3">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Megnevezés</th>
              <th>Kategória</th>
              <th>Mennyiség (liter)</th>
              <th>Beszállító</th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((drink, i) => (
              <tr key={drink.id}>
                <td>{i + 1}</td>
                <td>{drink.name}</td>
                <td>{drink.category}</td>
                <td>{getActualAmountFromWeight(drink)}</td>
                <td>{drink.supplierID}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      )}
    </>
  );
};

export default Main;
