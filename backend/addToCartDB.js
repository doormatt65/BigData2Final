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
      Status: "ACTIVE", // Other options: "PURCHASED"
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
module.exports = { addToCartInDynamoDB };
