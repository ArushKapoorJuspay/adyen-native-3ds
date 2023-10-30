const express = require("express");
const app = express();
const axios = require("axios");
const { json } = require("express");
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
//const orca = require("stripe")('sk_test_51KP0OALGEyT9T908osoVeWhMnrKSg6YibXTA84rLY5gGWvahr3uHZhAjKGXFicuNgPbZv2uYhIiylKsDHpKBcNuz00da02MYkB');
// const orca = require("@juspay-tech/hyper-node")('snd_c691ade6995743bd88c166ba509ff5da');

let apiKey = "AQEqhmfxLonIaRxDw0m/n3Q5qf3VYp5eHZJTfEBKcCjMgy67uj+B473X9LE3EMFdWw2+5HzctViMSCJMYAc=-HHyfbKKOmMLrYC66SIXv7BLBra9y3aAV94z2eUen1yY=-&Bb>?VTWADF7D$h("
let merchantAccount = "JuspayDEECOM"

app.use(express.json()); // Middleware to parse JSON request bodies


app.post("/sessions", async (req, res) => {
  //   const { items, country } = req.body;

  const config = {
    headers: { 'x-API-key': apiKey }
  };

  const body = {
    "merchantAccount": merchantAccount,
    "amount": {
      "value": 1000,
      "currency": "EUR"
    },
    "returnUrl": "https://your-company.com/checkout?shopperOrder=12xy..",
    "reference": "YOUR_PAYMENT_REFERENCE",
    "countryCode": "NL"
  }

  axios.post(
    'https://checkout-test.adyen.com/v70/sessions',
    body,
    config
  ).then(resp => {
    console.log("==> Resp", resp.data)
    res.send(resp.data);
  }).catch(err => {
    console.log("==> Err", err.response.data)
  })
})


app.post("/paymentMethods", async (req, res) => {
  //   const { items, country } = req.body;

  const config = {
    headers: { 'x-API-key': apiKey }
  };

  const body = {
    "merchantAccount": merchantAccount,
    "countryCode": "NL",
    "amount": {
      "currency": "EUR",
      "value": 1000
    },
    "channel": "Web",
    "shopperLocale": "nl-NL"
  }

  axios.post(
    'https://checkout-test.adyen.com/v70/paymentMethods',
    body,
    config
  ).then(resp => {
    res.send(resp.data);
  }).catch(err => {
    console.log("==> Err", err.response.data)
  })
})

app.post("/payments", async (req, res) => {
  //   const { items, country } = req.body;

  const config = {
    headers: { 'x-API-key': apiKey }
  };

  // console.log("===> req BOdy", req.body)
  let data = req.body.data
  const body = {
    "amount": {
      "currency": "EUR",
      "value": 1000
    },
    "reference": "YOUR_ORDER_NUMBER",
    "returnUrl": "https://adyen.serveo.net/success",
    "merchantAccount": merchantAccount,
    "paymentMethod": data.paymentMethod,
    "browserInfo": data.browserInfo,
    "channel": "Web",
    "origin": req.body.origin,
    "billingAddress": {
      "country": "NL",
      "city": "Capital",
      "houseNumberOrName": "1",
      "postalCode": "1012 DJ",
      "stateOrProvince": "DF",
      "street": "Main St"
    },
    "shopperEmail": "s.hopper@example.com",
    "shopperIP": "192.0.2.1",
    "deliveryAddress": {
      "country": "NL",
      "city": "Capital",
      "houseNumberOrName": "1",
      "postalCode": "1012 DJ",
      "stateOrProvince": "DF",
      "street": "Main St"
    }
  }

  console.log("===> isThreeDS", req.body.isThreeDS)

  if (req.body.isThreeDS) {
    body["authenticationData"] = {
      "threeDSRequestData": {
        "nativeThreeDS": "preferred"
      }
    }
  }

  axios.post(
    'https://checkout-test.adyen.com/v70/payments',
    body,
    config
  ).then(resp => {
    console.log("==> Resp", resp.data)
    res.send(resp.data);
  }).catch(err => {
    console.log("==> Err", err.response.data)
  })
})

app.post("/paymentDetails", async (req, res) => {
  //   const { items, country } = req.body;

  const config = {
    headers: { 'x-API-key': apiKey }
  };

  // console.log("===> req BOdy", req.body)
  let data = req.body.data
  console.log("==> data", data)
  console.log("==> Req", req.body)
  const body = data

  axios.post(
    'https://checkout-test.adyen.com/v70/payments/details',
    body,
    config
  ).then(resp => {
    console.log("==> paymentDetails Response", resp.data)
    res.send(resp.data);
  }).catch(err => {
    console.log("==> Err", err.response.data)
  })
})

app.listen(4242, () => console.log("Node server listening on port 4242!"));