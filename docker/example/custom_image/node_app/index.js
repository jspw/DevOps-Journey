const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json([
    {
      message: "Hello World!",
    },
    {
      message: "No World!",
    },
    {
      message: "Hello World!",
    },
    {
      message: "Hello World!",
    },
    {
      message: "No World!",
    },
    {
      message: "Hello World!",
    },
  ]);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
