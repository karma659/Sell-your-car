var express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
var connectDb = require("./models/connectionDB");
const {verifyToken} = require("./middlewares/authentication");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");

var app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
connectDb();
var port = process.env.PORT || 5000;

//  const dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "/frontend/build")));

   app.get("/", (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
   );
} else {
   app.get("/", (req, res) => {
      res.send("API is running....");
   });
}

//Go to Respective Routes
const dealerRoutes = require("./routes/dealerroutes");
const OemRoutes = require("./routes/Oemroutes");
const marketPlaceInventoryRoutes = require("./routes/marketPlaceInventoryroutes");
// const { getall } = require("./controllers/marketcontroller");



app.use("/dealer", dealerRoutes); // Dealer Routes
app.use("/oem", verifyToken, OemRoutes); //Oem Routes
app.use("/marketPlaceInventory", verifyToken, marketPlaceInventoryRoutes); //MarketPlace Routes

//Port Listening
app.listen(port, (req, res) => {
   console.log(`Server running on port ${port}`);
});
