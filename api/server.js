const { PORT } = require("./config");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { reports } = require("./data/reports");
const reportsRouter = require("./routes/reports");
const conversationsRouter = require("./routes/conversations");
const { errorHandler } = require("./middleware/errors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/reports", reportsRouter);
app.use("/api/conversations", conversationsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log(`Loaded ${reports.length} reports`);
  console.log(`Images served from ${path.join(__dirname, "images")}`);
});
