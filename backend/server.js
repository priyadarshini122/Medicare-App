const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const medRoutes = require("./routes/medications");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/medications", medRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
