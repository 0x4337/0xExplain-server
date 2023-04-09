const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

// sets the api key for the openai api to the value of the environment variable
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// creates an instance of the openai api with the config
const openai = new OpenAIApi(config);

router.post("/generate", async (req, res) => {
  // tries to make an API call to OpenAI and catch any errors

  try {
    // get the sourceCode from the request body
    const sourceCode = req.body.sourceCode;
    // const prompt = `Your job is to provide a detailed analysis of the following ethereum smart contract, explain what each function does and point out any dangerous features for users interacting with it, if any. Your response is going to be displayed on a page so ensure theres proper formatting and paragraphing: ${sourceCode}`;
    const prompt = `If you can read the following ethereum start contract respond with "Read contract successfully" ${sourceCode}`;
    // const prompt = "count to 50";

    // creates a completion object with the sourceCode as the prompt
    const { data } = await openai.createChatCompletion({
      // model: "gpt-3.5-turbo",
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    // respond with the data from the OpenAI API call
    res.json({ explanation: data.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error whilst trying to get explination",
      details: error.message,
    });
  }
});

router.post("/generateInteraction", async (req, res) => {
  try {
    const allData = req.body.allData;

    const promptIndex = req.body.promptIndex; // Get the prompt index from the request body

    // Define an array of slightly reworded prompts
    // const prompts = [
    //   `Provided is the decoded input data of an ethereum transaction along with the source code and abi of the contract the transaction is interacting with, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`,
    //   `Analyze the decoded input data of an ethereum transaction, the source code, and the ABI of the associated contract. Provide a summary of the transaction, the expected outcome, the function's behavior given the input, and any other pertinent details. ${allData}`,
    //   `Given the decoded input data of an ethereum transaction, the source code, and the ABI of the contract involved, provide an in-depth summary of the transaction, its expected outcome, the invoked function's actions based on the input, and any other relevant information. ${allData}`,
    //   `Provided is the source code and abi of the smart contract the decoded input data of a transaction is interacting with, your job is to provide a detailed account of what this transaction will do given the provided input and the context of the whole smart contract ${allData}`,
    //   `With the given decoded input data of an Ethereum transaction, source code, and ABI of the related contract, produce a comprehensive report of the transaction, its anticipated consequences, the function's behavior with the supplied input, and any additional crucial details. ${allData}`,
    //   `Examine the decoded input data of an Ethereum transaction, the contract's source code, and ABI. Summarize the transaction's specifics, its expected result, the actions of the invoked function based on the input, and any other essential information. ${allData}`,
    //   `Taking into account the decoded input data from an Ethereum transaction, as well as the contract's source code and ABI, provide an extensive analysis of the transaction, its predicted outcome, the operations of the invoked function given the input, and any other important context. ${allData}`,
    //   `Based on the decoded input data of an Ethereum transaction, the contract's source code, and ABI, generate an elaborate overview of the transaction, its foreseeable consequences, the function's response to the provided input, and any other noteworthy aspects. ${allData}`,
    // ];

    const prompts = [
      `Say 0`,
      `Say 1`,
      `Say 2`,
      `Say 3`,
      `Say 4`,
      `Say 5`,
      `Say 6`,
      `Say 7`,
    ];

    // Select the prompt based on the promptIndex
    const prompt = prompts[promptIndex];

    // // const prompt = `Provided is the source code and abi of the contract the transaction is interacting with along with the decoded input data, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`;
    // const prompt = `Provided is the decoded input data of an ethereum transaction along with the source code and abi of the contract the transaction is interacting with, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`;
    // // const prompt = `Provided is the source code and abi of an ethereum smart contract along with the decoded input data of a transaction that is interacting with the smart contract, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`;
    // // const prompt = `If you can read the following ethereum smart contract source code, abi and decoded transaction input data respond with "Read All successfully" ${allData}`;

    console.log(allData.length);
    const { data } = await openai.createChatCompletion({
      // model: "gpt-4",

      // Test Model:
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ explanation: data.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error whilst trying to get interaction summary",
      details: error.message,
    });
  }
});

module.exports = router;
