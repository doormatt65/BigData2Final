const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" }); // Region
const dynamodb = new AWS.DynamoDB();

async function getDataFromDynamoDB(pageNumber) {
  const itemsPerPage = 10;
  const startKey = (pageNumber - 1) * itemsPerPage + 1;
  const endKey = startKey + itemsPerPage - 1;

  const items = [];

  // Loop through each ItemID within the range
  for (let i = startKey; i <= endKey; i++) {
    const itemId = i.toString().padStart(5, "0"); // Convert to string and pad with zeros

    const params = {
      TableName: "Table",
      FilterExpression: "ItemID = :itemId",
      ExpressionAttributeValues: {
        ":itemId": { S: itemId }, // Use the appropriate data type for the attribute
      },
    };

    console.log(`Querying for ItemID: ${itemId}`);

    try {
      const data = await dynamodb.scan(params).promise();
      if (data.Items && data.Items.length > 0) {
        // Assuming each item has 'Title' and 'Author' properties
        data.Items.forEach((item) => {
          items.push({
            Title: item.Title.S, // Adjust property names based on your actual data structure
            Authors: item.Authors.S, // Adjust property names based on your actual data structure
            // ... other properties
          });
        });
      }
    } catch (error) {
      console.error(`Error retrieving data for ItemID ${itemId}:`, error);
    }
  }

  return items;
}

module.exports = { getDataFromDynamoDB };
