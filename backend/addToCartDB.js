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
      ":UserID": Number(UserID),
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
              Price: parseFloat(item.PageCount * 0.04).toFixed(2),
              // ... other properties
            },
          };
        } else {
          items[ISBN].count++;
        }
      });
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

async function checkout(UserID) {
  const params = {
    TableName: "Cart",
    IndexName: "UserID-ISBN-index", // Using the GSI
    KeyConditionExpression: "UserID = :UserID",
    FilterExpression: "ItemState = :itemstate",
    ExpressionAttributeValues: {
      ":UserID": Number(UserID),
      ":itemstate": "ACTIVE",
    },
  };

  try {
    const data = await docClient.query(params).promise();

    if (data.Items && data.Items.length > 0) {
      const updatePromises = data.Items.map(async (item) => {
        const updateParams = {
          TableName: "Cart",
          Key: {
            UserID: item.UserID,
            ItemAddedAt: item.ItemAddedAt,
          },
          UpdateExpression: "set ItemState = :newstate",
          ExpressionAttributeValues: {
            ":newstate": "PURCHASED",
          },
          ReturnValues: "ALL_NEW", // Change as needed
        };

        return docClient.update(updateParams).promise();
      });

      await Promise.all(updatePromises);
      console.log("Items marked as PURCHASED successfully.");
      return { success: true };
    } else {
      console.log("No items found for the given UserID and state.");
      return { success: false };
    }
  } catch (error) {
    console.error("Error marking items as PURCHASED:", error);
    throw error;
  }
}

async function removeItem(UserID, ISBN, num) {
  const paramsQuery = {
    TableName: "Cart",
    IndexName: "UserID-ISBN-index", // Using the GSI
    KeyConditionExpression: "UserID = :UserID and ISBN = :ISBN",
    FilterExpression: "ItemState = :itemstate",
    ExpressionAttributeValues: {
      ":UserID": Number(UserID),
      ":ISBN": ISBN,
      ":itemstate": "ACTIVE",
    },
  };

  try {
    const queryResult = await docClient.query(paramsQuery).promise();
    if (queryResult.Items && queryResult.Items.length > 0) {
      const itemsToUpdate = queryResult.Items.slice(0, num); // Select the specified number of items to cancel

      const updatePromises = itemsToUpdate.map(async (item) => {
        const updateParams = {
          TableName: "Cart",
          Key: {
            UserID: item.UserID,
            ItemAddedAt: item.ItemAddedAt,
          },
          UpdateExpression: "set ItemState = :newstate",
          ExpressionAttributeValues: {
            ":newstate": "CANCELLED",
          },
          ReturnValues: "ALL_NEW", // Change as needed
        };

        return docClient.update(updateParams).promise();
      });

      await Promise.all(updatePromises);
      console.log("Items marked as CANCELLED successfully.");
      return { success: true };
    } else {
      console.log("Item not found for UserID and ISBN with ACTIVE ItemState");
      return { success: false };
    }
  } catch (error) {
    console.error("Error marking items as CANCELLED:", error);
    throw error;
  }
}

module.exports = { addToCartInDynamoDB, getCart, checkout, removeItem };
