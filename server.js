//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const passport = require("passport");
const moment = require("moment");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

require("dotenv").config();


const Signup = require("./models/Signup"); // import model

//Intatiations
const app = express();
const PORT = 5000;


const indexRoutes = require("./routes/indexRoutes");
const additionRoutes = require("./routes/additionRoutes");
const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes");
const salesAgentRoutes = require("./routes/salesAgentRoutes");
const directorRoutes = require("./routes/directorRoutes");
const profileRoutes = require("./routes/profileRoutes");
const salesRoutes = require("./routes/salesRoutes");
// const salesRoutes = require("./routes/salesRoutes");



app.locals.moment = moment;
//configurations
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//middle wareapp.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); //specifies a folder for static files
app.use("/public/img/uploads", express.static(__dirname + "/public/img/uploads"));
app.use(express.urlencoded({ extended: true }));
// express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());


// // passport configs
passport.use(Signup.createStrategy());
passport.serializeUser(Signup.serializeUser());
passport.deserializeUser(Signup.deserializeUser());

//routes
app.use("/", indexRoutes);
app.use("/", additionRoutes);
app.use("/", authRoutes);
app.use("/", managerRoutes);
app.use("/", salesAgentRoutes);
app.use("/", directorRoutes);
app.use("/", profileRoutes);
app.use("/", salesRoutes);
// app.use("/", salesRoutes);



//redirection to unavailable page
app.get("*url", (req, res) => {
  res.send("oops! page not found");
});

//Bootstrapping Server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
