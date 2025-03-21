const express = require("express")
const Connect = require("./config/db")
const Cors = require("cors")

const app = express();
app.use(Cors())
app.use(express.json())

const port = process.env.PORT || 4000

Connect();

app.use('/', require('./Router/route'));

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});


app.listen(port,()=>{
  console.log('connected to a port')}
)
