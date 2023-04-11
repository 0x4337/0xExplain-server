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
    const promptIndex = req.body.promptIndex;

    const prompts = [
      `Your job is to provide a detailed analysis of the following ethereum smart contract, explain what each function does and point out any dangerous features for users interacting with it, if any ${sourceCode}`,
      `Analyze the given Ethereum smart contract in detail, describing the functionality of each function and pointing out any hazardous aspects for users who interact with the contract, if there are any. ${sourceCode}`,
      `Conduct a comprehensive examination of the Ethereum smart contract provided, describing the role of each function and highlighting any potentially harmful elements for users who engage with the contract, if such elements exist. ${sourceCode}`,
      `Perform a detailed evaluation of the Ethereum smart contract included, clarifying the function of each method and noting any potentially risky features for users who interact with the contract, if present. ${sourceCode}`,
      `Investigate the Ethereum smart contract presented, and offer a meticulous breakdown of its functions, explaining what each one does. Additionally, identify any unsafe characteristics for users who engage with the contract, if any are present. ${sourceCode}`,
    ];

    // Test prompts
    // const prompts = [`Say 1`, `Say 2`, `Say 3`, `Say 4`, `Say 5`];

    // Select the prompt based on the promptIndex
    const prompt = prompts[promptIndex];

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

    const prompts = [
      `Provided is the decoded input data of an ethereum transaction along with the source code and abi of the contract the transaction is interacting with, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`,
      `Analyze the decoded input data of an ethereum transaction, the source code, and the ABI of the associated contract. Provide a summary of the transaction, the expected outcome, the function's behavior given the input, and any other pertinent details. ${allData}`,
      `Given the decoded input data of an ethereum transaction, the source code, and the ABI of the contract involved, provide an in-depth summary of the transaction, its expected outcome, the invoked function's actions based on the input, and any other relevant information. ${allData}`,
      `Provided is the source code and abi of the smart contract the decoded input data of a transaction is interacting with, your job is to provide a detailed account of what this transaction will do given the provided input and the context of the whole smart contract ${allData}`,
      `With the given decoded input data of an Ethereum transaction, source code, and ABI of the related contract, produce a comprehensive report of the transaction, its anticipated consequences, the function's behavior with the supplied input, and any additional crucial details. ${allData}`,
      `Examine the decoded input data of an Ethereum transaction, the contract's source code, and ABI. Summarize the transaction's specifics, its expected result, the actions of the invoked function based on the input, and any other essential information. ${allData}`,
      `Taking into account the decoded input data from an Ethereum transaction, as well as the contract's source code and ABI, provide an extensive analysis of the transaction, its predicted outcome, the operations of the invoked function given the input, and any other important context. ${allData}`,
      `Based on the decoded input data of an Ethereum transaction, the contract's source code, and ABI, generate an elaborate overview of the transaction, its foreseeable consequences, the function's response to the provided input, and any other noteworthy aspects. ${allData}`,
    ];

    // Test prompts
    // const prompts = [
    //   `Say 0`,
    //   `Say 1`,
    //   `Say 2`,
    //   `Say 3`,
    //   `Say 4`,
    //   `Say 5`,
    //   `Say 6`,
    //   `Say 7`,
    // ];

    // Select the prompt based on the promptIndex
    const prompt = prompts[promptIndex];

    console.log(allData.length);
    const { data } = await openai.createChatCompletion({
      model: "gpt-4",
      // Test Model:
      // model: "gpt-3.5-turbo",
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
