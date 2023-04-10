const express = require("express");
const cors = require("cors");
const openaiRoutes = require("./routes/openaiRoutes");
const alchemyRoutes = require("./routes/alchemyRoutes");
const moduleRoutes = require("./routes/moduleRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/openai", openaiRoutes);
app.use("/api/alchemy", alchemyRoutes);
app.use("/api/module", moduleRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
