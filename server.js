const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());

const port = 8080;

const data = require('./data');

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
