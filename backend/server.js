const { getDataFromDynamoDB } = require("./dynamodb");
const { fetchProductInfo } = require("./fetchProductInfo");
const {
  addToCartInDynamoDB,
  getCart,
  checkout,
  removeItem,
} = require("./addToCartDB");
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

app.get("/products/:groupId/:isbn", async (req, res) => {
  const groupId = req.params.groupId; // Extract GroupID from URL parameter
  const isbn = req.params.isbn; // Extract ISBN from URL parameter

  try {
    const productDetails = await fetchProductInfo(groupId, isbn);
    res.json(productDetails); // Return product details as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product details" });
  }
});

app.post("/addToCart", express.json(), (req, res) => {
  const { UserID, item } = req.body;

  try {
    addToCartInDynamoDB(UserID, item);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

app.get("/getCart", async (req, res) => {
  const UserID = req.query.UserID;
  // console.log("getcart is called");
  try {
    const cartItems = await getCart(UserID);
    // console.log("function called");
    res.json(cartItems);
    console.log("Success:", cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

app.post("/checkout", express.json(), (req, res) => {
  const { UserID } = req.body;
  try {
    checkout(UserID);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to checkout" });
  }
});

app.post("/removeItem", express.json(), (req, res) => {
  const { UserID, ISBN, num } = req.body;
  try {
    removeItem(UserID, ISBN, num);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
