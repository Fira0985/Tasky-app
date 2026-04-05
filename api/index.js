const express = require("express")
const path = require("path")
const Connect = require("./Backend/Backend/config/db")
const Cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo").default

const app = express();

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_session_secret_tasky',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

Connect();

// Using the nested router
app.use('/', require('./Backend/Backend/Router/route'));

// Static files from the nested uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'Backend', 'Backend', 'uploads')));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running successfully at root level" });
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 4000
    app.listen(port, () => {
      console.log(`Server connected to port ${port}`)
    })
}

module.exports = app;
