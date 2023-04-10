const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");

const axios = require("axios");

const MODULE_API_KEY = process.env.MODULE_API_KEY;

router.get("/getNftsOwned/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const url = `https://api.modulenft.xyz/api/v2/eth/nft/owned?address=${walletAddress}&count=500&offset=0&type=all&withMetadata=true`;

    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "X-API-KEY": MODULE_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching NFTs" });
  }
});

router.get("/getNftStats/:contractAddress", async (req, res) => {
  try {
    const contractAddress = req.params.contractAddress;

    const url = `https://api.modulenft.xyz/api/v2/eth/nft/stats?contractAddress=${contractAddress}&marketplace=Opensea`;

    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "X-API-KEY": MODULE_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching NFT stats" });
  }
});

module.exports = router;
