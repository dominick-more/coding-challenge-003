const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());

const getData = () => {
  if (process.env.NODE_ENV === 'test') {
    return require('./data.json');
  }
  return require('./data');
};

const port = 8080;

const data = getData();

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
