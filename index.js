const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config/config.json")["development"]
const PORT = config.port1;
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to Map Analyzer");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is up and running on port ${PORT}`);
});
