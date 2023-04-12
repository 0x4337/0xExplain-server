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

    // const prompts = [
    //   `Your job is to provide a detailed analysis of the following ethereum smart contract, explain what each function does and point out any dangerous features for users interacting with it, if any ${sourceCode}`,
    //   `Analyze the given Ethereum smart contract in detail, describing the functionality of each function and pointing out any hazardous aspects for users who interact with the contract, if there are any. ${sourceCode}`,
    //   `Conduct a comprehensive examination of the Ethereum smart contract provided, describing the role of each function and highlighting any potentially harmful elements for users who engage with the contract, if such elements exist. ${sourceCode}`,
    //   `Perform a detailed evaluation of the Ethereum smart contract included, clarifying the function of each method and noting any potentially risky features for users who interact with the contract, if present. ${sourceCode}`,
    //   `Investigate the Ethereum smart contract presented, and offer a meticulous breakdown of its functions, explaining what each one does. Additionally, identify any unsafe characteristics for users who engage with the contract, if any are present. ${sourceCode}`,
    //   `Please review the given Ethereum smart contract and provide a clear, simple, and comprehensive explanation, tailored for beginners, that covers the following:

    //   1. The purpose of the smart contract and how it works.
    //   2. A brief description of each function and its role within the contract.
    //   3. Any other information that you think is relevant.
    //   4. Identification of any potentially risky features for users interacting with the contract, if applicable.

    //   Make sure to use easy-to-understand language, avoid technical jargon, and explain any necessary concepts in a beginner-friendly manner. Here's the smart contract source code:

    //   ${sourceCode}
    //   `,
    // ];

    // 3 is good

    // Test prompts
    // const prompts = [`Say 1`, `Say 2`, `Say 3`, `Say 4`, `Say 5`];

    // Test prompts with data
    const prompts = [
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT response 0" ${sourceCode}`,
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT response 1 ${sourceCode}"`,
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT response 2 ${sourceCode}"`,
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT response 3 ${sourceCode}"`,
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT response 4 ${sourceCode}"`,
      `If you are able to read the provided source code successfully respond with "Read contract successfully - This is test GPT simple response 5 ${sourceCode}"`,
    ];

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

    // const prompts = [
    //   `Provided is the decoded input data of an ethereum transaction along with the source code and abi of the contract the transaction is interacting with, your job is to provide a detailed summary of exactly what this transaction did, what the expected outcome is, what the function invoked will do given the provided input and any other relevant information. ${allData}`,
    //   `Analyze the decoded input data of an ethereum transaction, the source code, and the ABI of the associated contract. Provide a summary of the transaction, the expected outcome, the function's behavior given the input, and any other pertinent details. ${allData}`,
    //   `Given the decoded input data of an ethereum transaction, the source code, and the ABI of the contract involved, provide an in-depth summary of the transaction, its expected outcome, the invoked function's actions based on the input, and any other relevant information. ${allData}`,
    //   `Provided is the source code and abi of the smart contract the decoded input data of a transaction is interacting with, your job is to provide a detailed account of what this transaction will do given the provided input and the context of the whole smart contract ${allData}`,
    //   `With the given decoded input data of an Ethereum transaction, source code, and ABI of the related contract, produce a comprehensive report of the transaction, its anticipated consequences, the function's behavior with the supplied input, and any additional crucial details. ${allData}`,
    //   `Examine the decoded input data of an Ethereum transaction, the contract's source code, and ABI. Summarize the transaction's specifics, its expected result, the actions of the invoked function based on the input, and any other essential information. ${allData}`,
    //   `Taking into account the decoded input data from an Ethereum transaction, as well as the contract's source code and ABI, provide an extensive analysis of the transaction, its predicted outcome, the operations of the invoked function given the input, and any other important context. ${allData}`,
    //   `Based on the decoded input data of an Ethereum transaction, the contract's source code, and ABI, generate an elaborate overview of the transaction, its foreseeable consequences, the function's response to the provided input, and any other noteworthy aspects. ${allData}`,
    //   `Given the decoded input data of an Ethereum transaction, the source code, and the ABI of the involved contract, please explain in a clear and comprehensive manner, suitable for someone with little to no understanding of Ethereum, cryptocurrencies, or their ecosystems, the following:

    //   1. The purpose of this transaction and its expected outcome.
    //   2. The specific function invoked and its effect based on the provided input data.
    //   3. Any other relevant details that help clarify the transaction's context and implications.

    //   Make sure your explanation is easy to understand, digestible, and avoids unnecessary jargon. Here's the information you need: ${allData}
    //   `,
    // ];

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

    // Test prompts with data
    const prompts = [
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 0": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 1": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 2": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 3": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 4": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 5": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 6": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT response 7": ${allData}`,
      `if you are able to read the provided data, respond with "Read Txn Successfully - This is test GPT simple response 8": ${allData}`,
    ];

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
