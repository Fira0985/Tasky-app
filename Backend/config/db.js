const mongose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async () => {
    try{
        mongose.connect(process.env.MONGO_URL)
        console.log("Mongo DB Connected")
    } catch(err){
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectDB
