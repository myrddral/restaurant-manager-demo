import Button from "react-bootstrap/Button";
import getDateOfMeasure from "../utils/getDateOfMeasure";
import getTodaysMeasure from "../utils/getTodaysMeasure";
import getPreviousDaysMeasure from "../utils/getPreviousDaysMeasure";
import amountInLiter from "../utils/amountInLiter";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { useState } from "react";

const MeasuringMenubar = (props) => {
  const drinks = props.drinks;
  const drinkTypeListed = props.drinkTypeListed;
  const measureFrequency = props.measureFrequency;
  const [isReportPending, setIsReportPending] = useState(false);

  const handleClickReport = async () => {
    setIsReportPending(true);

    // Config variables
    const SPREADSHEET_ID = "12F-NMP2Mzv1sUBvewh4oFt5MPhMmEaDxQBSvU8YTZSM";

    const CLIENT_EMAIL =
      "gsheetconnect@restaurant-manager-f37d8.iam.gserviceaccount.com";
    const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0LkslokdIxwZF\nNe8enWKPT8Hz6Cdur2r1EU5e7jFdO9o7k9LIgxbvBkjggea7DSPqV1m3G64DcArQ\npaKWYRNOB9kdK8WtlZtUtvLqGqogvgRm+mN+thIbvATNI91I2p+NX+e93dM5FIHf\nD5mFiREuaw9uB4WyBfc5IWI4dXt/4Wdewwg9Bp/a0TAUwW0/21+BfldXC6vCpoov\nZgSWPXmRyiGMiHwi04ToLX1ptarn6oPQrjw0nDOCiG/eBpiQeRM6QPQriEXwPSnr\nEfCEFy16fc8KVUJBELmKYycVyYOH8tK+h/pleGhAYz2yNg5b59xQckW9l2/at0z1\nRGzo3FeRAgMBAAECggEAAWNt7s9OT1BBSx08R3cdAE+0BeYfD6pIX7UPbonVVYuV\nheoAsMzZy2O4AgreNUjHoxGjPlb3Q02Et9De7Nu4o1xKHwBsWIcTmFaEjqs/7lqo\nfAan550NjKspOk9xcBNHMXawuXTRINp4mbhsDWxd9oaaqtViAVosaoNIV3kIR5b4\nugOX0bSO3tqMdHj3rwsY5e/TOKEUPecq+GR5NKNOL2K2doRED84cWeiGXzIA0rxE\nIDBEBqSZhwXO9WwkWtIPVAfy3uiPr1fwaybudeIQfe3sduchv9yGi81aTjKqHjlS\n9xdAGb3s2eHUAnD8L+ZE6aF64RBJSLxa6LwtpGMCcQKBgQDuUwhXPD+NRsMb6g61\numx1LYhWZmKXxRjOg5Y5XxffDzXeEEoRd9VmbFSX+9zqpKy3WmcHotPGiDskoCZ2\nReWypcE2+1FeV8RABgrnwfsGsfeqLiUCVCMzuO0OYZNen3W4TolLRMCgsZ4e635C\n/jbpS5mFR22xwVkPUKNJFrClNQKBgQDBi1BSDkYFMHvtH1TbADi0EbF86GW4wIOo\noXK46NIMueLqJjP8Hv4KMme1aZnh2kLwOT9+HuY/i57rUJS210rPjUL1BeuUABOl\n63CsFXzJARbtL4eeN9BrzHF6xPSXBixnyZy/3ETpnqW+1GhlBkSPthLKUxnZ+Bf1\nGzT4884AbQKBgHR74PfCWs2SaIqcO9RW6evb9WdFY6sKirVlW2dvMxuzM4D2NT2U\ndJk7GZ2vXKrTEhgL94+j5h6DN2UPYb0tLLfEjEtzSrHx89nXGj1scmUzVvm21B/v\nP8Vn/XWp+32kMsWCnVhMolnodoBmWbAk0HH2oXKjFtpqxjzWDPkMPgqBAoGALTOm\nPKPMwqWCK+0nWkaA970yIKP+Ldn4ZcffDUSC2ioHzvvBJF7wod0Hz5ysLc1V2Njl\n9USuLaUkJn0ZXmKFvFeXjbYmQNiLvjJwjCAwlplEi3yQRelvKd4DmtKo9SSh9lNl\n4oFFLvK4bwsYno+KL64sUUh7PybsIXiLNKFsOTkCgYEAxQfBYrBn5bIjM4chZidy\nC6FgWQ+4oRvd/QMrituTn7HVBQkjyoL+Qmg5RRdR3wXpse1z/qAVQcDo05gXIZXd\nA7WlRMxoBvLzbxeJ4fY278EuNZTtMrHE3pOBacnVATRW9v33Yqz7/E0EP4B4bugE\nttK01IMW9r4TL4muEaoURNM=\n-----END PRIVATE KEY-----\n".replace(
      /\n/g,
      "\n"
    );

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      //creates a new sheet with today's date and respective headers

      const newSheet = await doc.addSheet({
        title: `${getDateOfMeasure()}-${drinkTypeListed}(${measureFrequency})`,
        headerValues: [
          "Sorszám",
          "Megnevezés",
          "Kategória",
          "UtolsóZárás",
          "MaiZárás",
          "KészletFogyás",
          "StandHiány",
        ],
      });

      const rows = [];

      drinks.forEach((drink, i) => {
        const previousAmount = (drink) => {
          return amountInLiter(getPreviousDaysMeasure(drink), drink);
        };
        const todaysAmount = (drink) => {
          return amountInLiter(getTodaysMeasure(drink), drink);
        };
        const difference = (drink) => {
          if (getTodaysMeasure(drink) === 0) {
            return 0;
          } else {
            return amountInLiter(
              getPreviousDaysMeasure(drink) - getTodaysMeasure(drink),drink);
          }
        };

        const newRow = {
          Sorszám: i + 1,
          Megnevezés: drink.name,
          Kategória: drink.category,
          UtolsóZárás: previousAmount(drink),
          MaiZárás: todaysAmount(drink),
          KészletFogyás: difference(drink),
          StandHiány: "",
        };
        rows.push(newRow);
      });

      await newSheet.addRows(rows);

      // open spreadsheet in a new window after the report is done
      // window.open(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`)
      alert('A riport beküldése megtörtént!')
      setIsReportPending(false);
    } catch (e) {
      console.log(e);
      if (e.toString().includes("sheet with the name")) {
        alert("A riportot már beküldted ma!");
      }
      setIsReportPending(false);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={handleClickReport}
        disabled={isReportPending}
      >
        Napi riport beküldése
      </Button>
    </>
  );
};

export default MeasuringMenubar;
