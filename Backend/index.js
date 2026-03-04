const express = require("express")
const Connect = require("./config/db")
const Cors = require("cors")

const app = express();

// Middleware for logging requests and response time
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });

    next();
});

app.use(Cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json({ limit: '10mb' })) // Increase payload limit
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 4000

Connect();

app.use('/', require('./Router/route'));

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});


app.listen(port,()=>{
  console.log('connected to a port')}
  
)
