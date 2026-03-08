# How to Run Tasky-app

Follow these steps to get the project running on your local machine.

## Prerequisites
- **Node.js**: Ensure you have Node.js (v14+) and npm installed.
- **MongoDB**: You need a running MongoDB instance or a MongoDB Atlas connection string (already provided in the backend `.env`).

---

## 1. Backend Setup
The backend handles the API, database connection, and authentication.

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env` file exists with the following (it should already be there):
   ```env
   PORT=3002
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server will run on [http://localhost:3002](http://localhost:3002)*

---

## 2. Frontend Setup
The frontend is the React application.

1. Open a **new** terminal window and navigate to the `react_file` directory:
   ```bash
   cd react_file
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The app will automatically open in your browser at [http://localhost:3000](http://localhost:3000)*

---

## 3. Verify Connection
- Once both are running, go to the landing page.
- Try to **Sign Up** or **Login**.
- If everything is configured correctly, you will be redirected to the **User Dashboard** where you can manage your tasks and projects.

---

## Troubleshooting
- **Port Conflict**: If port `3000` or `3002` is in use, you can change them in the respective `.env` files.
- **Database Error**: Ensure your IP address is whitelisted in MongoDB Atlas if using the provided connection string.
