const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
const dynamodb = new AWS.DynamoDB();

async function getDataFromDynamoDB(groupId) {
  const items = [];

  const params = {
    TableName: "Books",
    KeyConditionExpression: "GroupID = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { S: groupId.toString() },
    },
  };

  try {
    const data = await dynamodb.query(params).promise();

    if (data.Items && data.Items.length > 0) {
      data.Items.forEach((item) => {
        items.push({
          ItemID: item.ItemID.S,
          Title: item.Title.S,
          Authors: item.Authors.S,
          ISBN: item.ISBN.S,
          NumPages: parseInt(item.NumPages.N),
          // ... other properties
        });
        console.log(
          "GroupID: " +
            item["GroupID"].S +
            " ID: " +
            item["ItemID"].S +
            " " +
            item["Title"].S
        );
      });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
  }

  return items;
}

module.exports = { getDataFromDynamoDB };
