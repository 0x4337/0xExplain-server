const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");

// Imports the CoinGeko API
const CoinGecko = require("coingecko-api");

// Creates an instance of the CoinGecko API
const CoinGeckoClient = new CoinGecko();

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

router.get("/getTokenBalances/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const balances = await alchemy.core.getTokenBalances(walletAddress);

    // Remove tokens with zero balance
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    console.log(`Token balances of ${walletAddress} \n`);

    // An array to store the tokens with their information
    const tokensInfo = [];

    // Loop through all tokens with non-zero balance
    for (let token of nonZeroBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(2);

      // Add the token's information to the tokensInfo array
      tokensInfo.push({
        name: metadata.name,
        balance: balance,
        symbol: metadata.symbol,
      });
    }

    // Return the tokensInfo array as a response
    res.json(tokensInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching token balances" });
  }
});

router.get("/getBalance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const balance = await alchemy.core.getBalance(walletAddress);

    // Convert the balance to ETH
    const balanceInETH = Number((balance / Math.pow(10, 18)).toFixed(4));

    // returns the balance in usd using the CoinGecko API
    const price = await CoinGeckoClient.simple.price({
      ids: ["ethereum"],
      vs_currencies: ["usd"],
    });

    // Compute the balance in USD
    const balanceInUSD = Math.floor(balanceInETH * price.data.ethereum.usd);

    // Return the balance in ETH and USD
    res.json({ balanceInETH, balanceInUSD });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet balance" });
  }
});

router.get("/getTxns/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    // Call the method to display the transaction based on the transaction hash
    const response = await alchemy.core.getAssetTransfers({
      fromAddress: walletAddress,
      excludeZeroValue: true,
      category: ["erc20", "erc721", "erc1155"],
    });

    // Send the response to the client
    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching full transaction details",
      error: error,
    });
  }
});

router.get("/getCreationDate/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const response = await alchemy.core.getTransactionCount(walletAddress);
    const block = await alchemy.core.getBlock(response, true);
    const timestamp = block.timestamp;

    const date = new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    res.json(date);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet creation date" });
  }
});

router.get("/getTxnCount/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const response = await alchemy.core.getTransactionCount(walletAddress);

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wallet transaction count" });
  }
});

// router.get("/getGasTotal/:walletAddress", async (req, res) => {
//   try {
//     const walletAddress = req.params.walletAddress;

//     const response = await alchemy.core.getAssetTransfers({
//       fromAddress: walletAddress,
//       category: ["erc20", "erc721", "erc1155"],
//     });

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching wallet gas total" });
//   }
// });

// router.get("/getNumMinted/:walletAddress", async (req, res) => {
//   try {
//     const walletAddress = req.params.walletAddress;

//     // Fetch minted NFTs
//     const response = await alchemy.nft.getMintedNfts(walletAddress);

//     // Fetch spam contracts
//     const spamResponse = await alchemy.nft.getSpamContracts();

//     // Get the spam contract addresses
//     const spamAddresses = spamResponse.map((contract) => contract.address);

//     // Filter minted NFTs by excluding spam contracts
//     const filteredNfts = response.nfts.filter(
//       (nft) => !spamAddresses.includes(nft.contract.address)
//     );

//     // Return the count of minted NFTs after excluding spam contracts
//     res.json({ count: filteredNfts.length });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching number of minted NFTs" });
//   }
// });

// router.get("/getNFTs/:walletAddress", async (req, res) => {
//   try {
//     const walletAddress = req.params.walletAddress;

//     const response = await alchemy.nft.getNftsForOwner(walletAddress);

//     // Check if each NFT is a spam contract

//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching NFTs" });
//   }
// });

router.get("/getNFTs/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const response = await alchemy.nft.getNftsForOwner(walletAddress);
    const ownedNfts = response.ownedNfts;

    // Check if each NFT is a spam contract and filter out the spam NFTs
    const nonSpamNfts = [];

    for (const nft of ownedNfts) {
      const contractAddress = nft.contract.address;
      const isSpam = await alchemy.nft.isSpamContract(contractAddress);

      if (!isSpam.result) {
        nonSpamNfts.push(nft);
      }
    }

    res.json({ ownedNfts: nonSpamNfts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching NFTs" });
  }
});

module.exports = router;
