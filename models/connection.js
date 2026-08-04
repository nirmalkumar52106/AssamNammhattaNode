
const mongoose = require("mongoose");

const dburl = "mongodb+srv://kumarnirmal52106_db_user:2Ve2kv5mimCibWk5@cluster0.fxgalqs.mongodb.net/?appName=Cluster0"

mongoose.set("strictQuery", true);

mongoose
  .connect(dburl, {
    family: 4,
      serverSelectionTimeoutMS: 300000, 
      socketTimeoutMS: 300000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("⚠ MongoDB Disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB Reconnected");
});

module.exports = mongoose;