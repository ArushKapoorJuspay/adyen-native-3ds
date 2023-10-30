import React, { useEffect, useRef, useState } from "react"
import './App.css';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function App() {
  const adyenRef = useRef();
  const globalDropin = useRef(undefined)
  const globalAlignment = useRef('left')

  const [alignment, setAlignment] = useState('left')
  const [finalMsg, setFinalMsg] = useState('')

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment != null) {
      setAlignment(newAlignment)
      globalAlignment.current = newAlignment
    }

  };

  console.log("===> Alignment", alignment)


  let dropIn = async () => {

    if (window.AdyenCheckout && adyenRef.current) {
      let response = await fetch("/paymentMethods", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-API-Key": "AQEshmfxK4vJahdBw0m/n3Q5qf3Ve4pAHYFLSzQElarEnHHcAF177/h7eYLz254QwV1bDb7kfNy1WIxIIkxgBw==-1ImpGSzYdkyPPud14SRghcqbIMCwbjdln2wJcNyac8M=-a*&RPTeY8@p])Q$L" },
        body: JSON.stringify({})
      })

      let data = await response.json();

      const configuration = {
        paymentMethodsResponse: data, // The `/paymentMethods` response from the server.
        clientKey: "test_7RMBQUBNX5ARPGLM7QFDUY6QFMRS3V4Y", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
        locale: "en-US",
        environment: "test",
        analytics: {
          enabled: false // Set to false to not send analytics data to Adyen.
        },
        paymentMethodsConfiguration: {
          card: { // Example optional configuration for Cards
            hasHolderName: true,
            holderNameRequired: true,
            enableStoreDetails: true,
            name: 'Credit or debit card',
            // billingAddressRequired: true,
          },
          threeDS2: { // Web Components 4.0.0 and above: sample configuration for the threeDS2 action type
            challengeWindowSize: '02'
          },
        }
      };


      const checkout = await window.AdyenCheckout(configuration);

      const dropin = checkout
        .create('dropin', {
          // Starting from version 4.0.0, Drop-in configuration only accepts props related to itself and cannot contain generic configuration like the onSubmit event.
          openFirstPaymentMethod: false,
          onSubmit: (state, dropin) => {
            // Global configuration for onSubmit
            // Your function calling your server to make the `/payments`

            console.log("==> alignment Inside Submit", globalAlignment);

            fetch("/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-API-Key": "AQEshmfxK4vJahdBw0m/n3Q5qf3Ve4pAHYFLSzQElarEnHHcAF177/h7eYLz254QwV1bDb7kfNy1WIxIIkxgBw==-1ImpGSzYdkyPPud14SRghcqbIMCwbjdln2wJcNyac8M=-a*&RPTeY8@p])Q$L" },
              body: JSON.stringify({ data: state.data, origin: window.location.origin, isThreeDS: globalAlignment.current == "center" })
            })
              .then(response => response.json())
              .then(data => {
                if (data.action) {
                  globalDropin.current.handleAction(data.action);
                } else {
                  console.log("===> Successful Payment Happened Maybe")
                }
              })
              .catch(error => {
                console.log("===> error", error)
              })
          },
          onAdditionalDetails: (state, dropin) => {
            console.log("==> AdditionalDetails", state.data)
            fetch("/paymentDetails", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-API-Key": "AQEshmfxK4vJahdBw0m/n3Q5qf3Ve4pAHYFLSzQElarEnHHcAF177/h7eYLz254QwV1bDb7kfNy1WIxIIkxgBw==-1ImpGSzYdkyPPud14SRghcqbIMCwbjdln2wJcNyac8M=-a*&RPTeY8@p])Q$L" },
              body: JSON.stringify({ data: state.data })
            })
              .then(response => response.json())
              .then(data => {
                setFinalMsg(data.resultCode)
                console.log("===> data", data)
              }
              )
              .catch(err => console.log("==> err", err))
          },
        })
        .mount(adyenRef.current);

      globalDropin.current = dropin
    }
  }

  useEffect(() => {
    dropIn()
  }, [])



  return (
    <div className="App">
      <div style={{ marginBottom: "8px" }}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned">
            <div>Redirection</div>
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <div>Native 3DS</div>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {finalMsg ? <div style={{ marginBottom: "16px" }}>Payment Status - {finalMsg}</div> : <></>}
      <div ref={adyenRef}></div>
    </div>
  );
}

export default App;
