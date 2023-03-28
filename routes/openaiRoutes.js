const { Router } = require("express");
const { Configuration, OpenAIApi } = require("openai");

const router = Router();

// sets the api key for the openai api to the value of the environment variable
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// creates an instance of the openai api with the config
const openai = new OpenAIApi(config);

router.post("/explain", async (req, res) => {
  // tries to make an API call to OpenAI and catch any errors
  try {
    // get the sourceCode from the request body
    const sourceCode = req.body.sourceCode;

    // creates a completion object with the sourceCode as the prompt
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      message: [{ role: "user", content: sourceCode }],
    });

    // respond with the data from the OpenAI API call
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", details: error.message });
  }
});

module.exports = router;
