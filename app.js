const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoutes");
const bookRoute = require("./routes/bookRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: ["https://book-exchange-red.vercel.app/"], credentials: true }));
app.use(bodyParser.json());

app.use("/api", authRoute);
app.use("/api", bookRoute);

app.get("/", (req, res) => {
  res.send("Book Exchange API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
