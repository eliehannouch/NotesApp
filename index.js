const express = require("express");
const app = express();
const DB = require("./database");
const dotenv = require("dotenv");

// routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const notesRoutes = require("./routes/noteRoutes");

dotenv.config();
DB.connect();

app.use(express.json());
app.use("/api/auth/users", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", notesRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});
