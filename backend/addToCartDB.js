// This file can contain your logic for interacting with DynamoDB
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

async function addToCartInDynamoDB(UserID, item) {
  // const items = [];
  //Partition key = UserID, sort key = Status

  const params = {
    TableName: "Cart",
    Item: {
      UserID: UserID,
      Title: item.Title,
      Authors: item.Authors,
      ISBN: item.ISBN,
      Publisher: item.Publisher,
      PageCount: item.PageCount,
      Rating: item.Rating,
      ItemState: "ACTIVE", // Other options: "PURCHASED"
      ItemAddedAt: new Date().toISOString(),
    },
  };
  console.log("Adding a new item...");
  console.log(params);
  docClient.put(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Item added successfully:", JSON.stringify(data, null, 2));
    }
  });
}

async function getCart(UserID) {
  const items = {};

  const params = {
    TableName: "Cart",
    KeyConditionExpression: "UserID = :UserID",
    FilterExpression: "ItemState = :itemstate",
    ExpressionAttributeValues: {
      ":UserID": Number(UserID), // Assuming UserID corresponds to GroupID
      ":itemstate": "ACTIVE",
    },
  };

  try {
    const data = await docClient.query(params).promise();

    if (data.Items && data.Items.length > 0) {
      data.Items.forEach((item) => {
        const ISBN = item.ISBN;
        if (!items[ISBN]) {
          items[ISBN] = {
            count: 1,
            details: {
              Title: item.Title,
              Authors: item.Authors,
              ISBN: ISBN,
              Publisher: item.Publisher,
              PageCount: parseInt(item.PageCount),
              Rating: parseFloat(item.Rating),
              // ... other properties
            },
          };
        } else {
          items[ISBN].count++;
        }
      });
      console.log("Items:", items);
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }

  return Object.values(items).map((item) => ({
    ...item.details,
    count: item.count,
  }));
}

module.exports = { addToCartInDynamoDB, getCart };
