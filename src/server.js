const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const path = require("path");
const listingsRoutes = require("./services/listings");
const reviewsRoutes = require("./services/reviews");


const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3001;


const whiteList = //creating an array, if we are in this mode, then do this
  process.env.NODE_ENV === "production" //this is a cloud provider code for production
    ? [process.env.FE_URL_PROD] //this is not from .env but rather the keys in heroku
    : [process.env.FE_URL_DEV];

// const whiteList =[
//     process.env.FE_URL_PROD, process.env.FE_URL_DEV
// ]

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.indexOf(origin) !== -1) {
//       // allowed
//       callback(null, true);
//     } else {
//       // Not allowed
//       callback(new Error("NOT ALLOWED - CORS ISSUES"));
//     }
//   },
// };


// server.use(cors(corsOptions)); // needed for frontend testing

server.use(cors());
server.use(express.static(path.join(__dirname, '../public/img')))
server.use(express.json());


//ROUTES

server.use("/listings", listingsRoutes);
server.use("/reviews", reviewsRoutes);


// ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Running on cloud on port", port);
  } else {
    console.log("Running locally on port", port);
  }
});
