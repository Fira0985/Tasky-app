const express = require("express")
const Connect = require("./config/db")
const Cors = require("cors")
// Triggering restart to resolve port conflict

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
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000'
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json({ limit: '10mb' })) // Increase payload limit
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 4000

Connect();

app.use('/', require('./Router/route'));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running successfully" });
});


app.listen(port, () => {
  console.log('connected to a port')
}

)
