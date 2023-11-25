const { getDataFromDynamoDB } = require("./dynamodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors()); // Enable CORS for all routes

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/dbinfo", async (req, res) => {
  const pageNumber = req.query.page || 1; // Default page number is 1 if not provided

  try {
    const data = await getDataFromDynamoDB(parseInt(pageNumber, 10));
    res.json(data); // Return the retrieved data as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
