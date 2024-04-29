const express = require("express");
const cors = require("cors");
const { connectDb } = require("./utils/connectDb");
require("dotenv").config();
const port = process.env.PORT || 8000;
const app = express();
const userRoute = require("./routes/userRoute");
const redisdemo = require("./routes/redisCacheExmpRoute");
const queue = require("./routes/queueRoute");
const cookieParser = require("cookie-parser");

//middleWire
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//MongoDb connection
connectDb();

// Routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/redis", redisdemo);
app.use("/api/v1/queue", queue);

app.get("/", async (req, res) => {
  res.send("Task Server is Running");
});

//Error Handeling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMassage = err.message || "Something went wrong";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMassage,
    stack: err.stack,
  });
});

// //All
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => console.log(`Task Server Running On ${port}`));
