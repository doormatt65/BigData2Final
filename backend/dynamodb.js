const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

async function getDataFromDynamoDB(groupId) {
  const items = [];

  const params = {
    TableName: "Table", // Replace 'YourTableName' with your actual table name
    KeyConditionExpression: "GroupID = :groupId",
    ExpressionAttributeValues: {
      ":groupId": groupId, // Assuming GroupID is a number
    },
  };

  try {
    const data = await docClient.query(params).promise();

    if (data.Items && data.Items.length > 0) {
      data.Items.forEach((item) => {
        items.push({
          GroupID: item.GroupID, // Assuming GroupID is a number
          ItemID: item.ItemID, // Assuming ItemID is a number
          // Assuming other attributes exist in the same format as your previous function
          Title: item.Title,
          Authors: item.Authors,
          ISBN: item.ISBN,
          Publisher: item.Publisher,
          PageCount: parseInt(item.PageCount), // Assuming NumPages is a number
          Rating: parseFloat(item.Rating), // Assuming Rating is a number

          // ... other properties
        });
        console.log(
          "GroupID: " +
            item["GroupID"] +
            " ID: " +
            item["ItemID"] +
            " " +
            item["Title"] +
            " " +
            item["PageCount"]
        );
      });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }

  return items;
}

module.exports = { getDataFromDynamoDB };
