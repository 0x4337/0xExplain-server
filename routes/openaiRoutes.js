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

module.exports = router;
