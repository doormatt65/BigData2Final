const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" }); // Region
const dynamodb = new AWS.DynamoDB();

async function getDataFromDynamoDB(pageNumber) {
  const itemsPerPage = 11;
  const startPartition = (pageNumber - 1) * itemsPerPage + 1;
  const endPartition = startPartition + itemsPerPage - 1;

  const items = [];

  for (let i = startPartition; i <= endPartition; i++) {
    const partitionKey = i.toString().padStart(5, "0"); // Convert to string and pad with zeros

    const params = {
      TableName: "Table",
      IndexName: "ItemID-index", // Use the GSI for querying by ItemID
      KeyConditionExpression: "ItemID = :itemID",
      ExpressionAttributeValues: {
        ":itemID": { S: partitionKey }, // ItemID is the partition key in the index
      },
    };

    try {
      const data = await dynamodb.query(params).promise();

      if (data.Items && data.Items.length > 0) {
        data.Items.forEach((item) => {
          items.push({
            ItemID: item.ItemID.S, // Adjust property names based on your actual data structure
            Title: item.Title.S,
            Authors: item.Authors.S,
            ISBN: item.ISBN.S,
            NumPages: parseInt(item.NumPages.N), // Convert to number if needed
            // ... other properties
          });
          console.log("ID: " + item["ItemID"].S + " " + item["Title"].S);
        });
      }
    } catch (error) {
      console.error(
        `Error retrieving data for partition ${partitionKey}:`,
        error
      );
    }
  }

  return items;
}

module.exports = { getDataFromDynamoDB };
