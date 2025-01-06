const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const { authRouter } = require("../src/routes/auth.route");
const { customerRouter } = require("../src/routes/customer.route");
const { orderRouter } = require("../src/routes/order.route");
const { productRouter } = require("../src/routes/product.route");
const { stockRouter } = require("../src/routes/stock.route");
const { userRouter } = require("../src/routes/user.route");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to database established");
  } catch (err) {
    console.log("Failed to connect to database", err);
  }
}

app.use(express.json());
app.use("/api/login", authRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/register", userRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

connectToDb();
