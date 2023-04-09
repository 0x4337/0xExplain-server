const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");

// Imports the Alchemy SDK
const { Alchemy, Network } = require("alchemy-sdk");

// Configures the Alchemy SDK
const config = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your API key
  network: Network.ETH_MAINNET, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

// Define a new route for /getTxnBasic
router.get("/getTxnBasic/:txnHash", async (req, res) => {
  try {
    const txnHash = req.params.txnHash;

    // Call the method to display the transaction based on the transaction hash
    const response = await alchemy.transact.getTransaction(txnHash);

    // Send the response to the client
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching basic transaction details" });
  }
});

router.get("/getTxnFull/:txnHash", async (req, res) => {
  try {
    const txnHash = req.params.txnHash;

    // Call the method to display the transaction based on the transaction hash
    const response = await alchemy.core.getTransactionReceipt(txnHash);
    console.log(response);

    // Send the response to the client
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching full transaction details" });
  }
});

// An endpoint to mock a response from the live API
router.get("/testPending", async (req, res) => {
  try {
    const pendingData = fs.readFileSync(
      "./data/testJSON/testPending.json",
      "utf8"
    );

    // const pendingData = 1;

    res.json(pendingData);
  } catch (error) {
    console.log(error);
  }
});

// router.get("getCode/:address", async (req, res) => {
//   try {
//     const address = req.params.address;

//     const response = await alchemy.core.getCode(address);

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching contract code" });
//   }
// });

module.exports = router;
