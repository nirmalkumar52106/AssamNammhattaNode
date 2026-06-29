const mongoose = require("mongoose")

const dburl ="mongodb+srv://kumarnirmal52106_db_user:2Ve2kv5mimCibWk5@cluster0.fxgalqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dburl , {
      family: 4 ,
}).then(()=>{
    console.log("success")
}).catch((error)=>{
    console.log("error" , error)
})