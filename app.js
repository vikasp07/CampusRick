require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const rideRoutes = require("./routes/rides");
const groupRoutes = require("./routes/group");
const driverRoutes = require("./routes/driver");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/rides", rideRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/drivers", driverRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
