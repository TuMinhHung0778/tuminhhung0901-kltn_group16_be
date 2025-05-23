import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import cron from "node-cron";
import patientService from "./services/patientService";
import aiChatRoute from './routes/aiChatRoute';
import momoRoute from './routes/momoRoute.js';

require("dotenv").config();

let app = express();
// app.use(cors({ origin: true }))

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoutes(app);

app.use('/', aiChatRoute);



connectDB();

// Cron job re-send mail
cron.schedule("00 54 15 * * *", function () {
  /*
   * Runs every day
   * at 9:00:00 AM
   */
  console.log("---------------------");
  console.log("Running Cron Job");
  patientService.resendBookingAppointment();
});

let port = process.env.PORT || 8080;
//Port === undefined => port = 6969

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is runing on the port : " + port);
});

