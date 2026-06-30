const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser")
const adminRoutes = require("./routes/adminRoutes");
const devoteeRoutes = require("./routes/devoteeRoutes");
const donationRoutes = require("./routes/donationRoutes");


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true })); 
app.use(bodyParser.json());


require("./models/connection")


app.use("/api/admin", adminRoutes);
app.use("/api/devotees", devoteeRoutes);
app.use("/api/donation", donationRoutes);

app.get("/",(req,res)=>{
  res.send("hello")
})

app.listen(8000, () => {
  console.log("Server running on port 8000");
});