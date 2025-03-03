const express = require("express");
const cors = require("cors");
const config = require("./config/config.json")["development"];
const zoneRoutes = require("./routes/zoneCoordinate.routes");
const productRoutes = require("./routes/productRoutes");
const app = express();
const PORT = config.port1;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Map Analyzer");
});

app.use("/api", zoneRoutes);
app.use("/api", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
