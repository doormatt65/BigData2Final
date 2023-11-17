const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });

const dynamodb = new AWS.DynamoDB();

async function getDataFromDynamoDB() {
  const params = {
    TableName: "Books",
    Key: {
      id: { S: "000" },
    },
  };
  console.log(dynamodb);
  try {
    console.log("Retrieving data from DynamoDB...");
    const data = await dynamodb.getItem(params).promise();
    console.log("Data retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
}

module.exports = { getDataFromDynamoDB };
