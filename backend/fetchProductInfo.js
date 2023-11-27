const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

async function fetchProductInfo(groupId, isbn) {
  console.log("fetchProductInfo: " + groupId + " " + isbn);

  const params = {
    TableName: "Table",
    KeyConditionExpression: "GroupID = :groupId",
    FilterExpression: "ISBN = :isbn",
    ExpressionAttributeValues: {
      ":groupId": Number(groupId),
      ":isbn": isbn,
    },
  };

  try {
    const data = await docClient.query(params).promise();
    console.log("Data:", data);

    if (data.Items.length > 0) {
      return data.Items[0]; // Return the first matching item
    } else {
      return null; // If no matching item is found
    }
  } catch (error) {
    console.error("Error retrieving item:", error);
    throw error;
  }
}

module.exports = { fetchProductInfo };
