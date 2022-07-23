const express = require("express");
const cors = require("cors");
const { connect } = require("http2");
const app = express();
const db = require("./app/models");
const apiData = require("./data.json");

var options = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
db.mongoose
  .connect(db.url, options)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./app/routes/user.routes")(app);

// set port, listen for requests
const port = process.env.PORT || 8000;
// const PORT = "https://shopsy-backend-api.herokuapp.com/";

app.get("/", (req, res) => {
  res.send("Hello this is shopsy backend API endpoint");
});

app.get("/service", (req, res) => {
  res.send(apiData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
