import { Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import "./Scale.css";

const Scale = (props) => {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState(null);
  // eslint-disable-next-line
  const [scaleState, setScaleState] = useState("");
  // eslint-disable-next-line
  const [unit, setUnit] = useState("");
  // eslint-disable-next-line
  const [weight, setWeight] = useState("?");
  const [error, setError] = useState("");

  const HID_FILTERS = [
    { vendorId: 0x0922, productId: 0x8003 }, // 10lb scale
    { vendorId: 0x0922, productId: 0x8004 }, // 25lb scale
  ];

  // const UNIT_MODES = { 2: "g", 11: "oz" };
  const SCALE_STATES = { 2: "±", 4: "+", 5: "-" };

  const bindDevice = (device) => {
    device
      .open()
      .then(() => {
        console.log(`Connected ${device.productName}`, device);
        setConnected(true);
        setDevice(device);

        if (device.configuration === null) {
          return device.selectConfiguration(1);
        }
      })
      .then(() =>
        device.addEventListener("inputreport", (event) => {
          const { data } = event;
          let buffArray = new Uint8Array(data.buffer);
          let weight = buffArray[3] + 256 * buffArray[4];


          const unit = "g"; /*UNIT_MODES[buffArray[0]];*/

          if (unit === "oz") {
            // Use Math.pow to avoid floating point math.
            weight /= Math.pow(10, 1);
          }

          setScaleState(SCALE_STATES[data[1]]);

          setWeight(weight);
          props.setCurrentMeasure(weight)
          props.setIsScaleConnected(true)
          setUnit(unit);
        })
      )
      .catch((err) => {
        console.error("HID Error", err);
        setError(err.message);
      });
  };

  const connect = () => {
    navigator.hid
      .requestDevice({ filters: HID_FILTERS })
      .then((device) => bindDevice(device))
      .catch((error) => {
        console.error(error);
        disconnect();
      });
  };
  const disconnect = () => {
    setConnected(false);
    props.setIsScaleConnected(false)
    setDevice(null);
    setWeight("?");

    if (navigator.hid) {
      navigator.hid.getDevices({ filters: HID_FILTERS }).then((devices) => {
        devices.forEach((device) => {
          bindDevice(device);
        });
      });

      navigator.hid.addEventListener("connect", (e) => {
        console.log("device connected", e);
        bindDevice(e.device);
      });

      navigator.hid.addEventListener("disconnect", (e) => {
        console.log("device lost", e);
        disconnect();
      });
    }
  };

  return (
    <main>
      {!connected && <h3>A mérleg jelenleg offline</h3>}

      {!navigator.hid && (
        <p>
          Please enable
          chrome://flags/#enable-experimental-web-platform-features
        </p>
      )}

      {error && <p>{error}</p>}

      {!device && <Button onClick={connect}>Kapcsolódás</Button>}
      
    </main>
  );
};

export default Scale;
