if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routers");
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hallo kak");
});
app.use("/", router);

app.listen(port, () => {
  console.log(process.env.NODE_ENV, "env");
  console.log(`Listening on port ${port}`);
});
