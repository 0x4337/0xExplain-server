const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const openaiRoutes = require("./routes/openaiRoutes");

require("dotenv").config();

app.use(express.json());
app.use(express.static("public"));

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/explain", openaiRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
