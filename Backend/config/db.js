const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async () => {
    try{
        const mongo = await mongoose.connect(process.env.MONGO_URL)
        console.log(process.env.MONGO_URL)
        console.log("Mongo DB Connected")
        console.log("Connected to Database:", mongo.connection.name);
    } catch(err){
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB
