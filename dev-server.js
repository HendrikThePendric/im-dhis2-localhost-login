const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("app"));

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
