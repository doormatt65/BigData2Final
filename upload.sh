#!/bin/bash

# Define your AWS CLI profile and region
AWS_PROFILE="default"
AWS_REGION="us-east-2"

# Define your DynamoDB table name
DYNAMODB_TABLE_NAME="Books"

# # Loop through each line in the CSV file and put it into DynamoDB
# while IFS=, read -r BookID Title Authors AverageRating ISBN NumPages Publisher
# do
#   # Use AWS CLI to put each item into the DynamoDB table
#   # aws dynamodb put-item --table-name "$DYNAMODB_TABLE_NAME" --item "{\"BookID\":{\"S\":\"$BookID\"},\"Title\":{\"S\":\"$Title\"},\"Authors\":{\"S\":\"$Authors\"},\"AverageRating\":{\"N\":\"$AverageRating\"},\"ISBN\":{\"S\":\"$ISBN\"},\"NumPages\":{\"N\":\"$NumPages\"},\"Publisher\":{\"S\":\"$Publisher\"}"  --profile "$AWS_PROFILE" --region "$AWS_REGION"
#   aws dynamodb put-item --table-name "$DYNAMODB_TABLE_NAME" --item "{\"BookID\":{\"S\":\"$BookID\"},\"Title\":{\"S\":\"$Title\"},\"Authors\":{\"S\":\"$Authors\"},\"AverageRating\":{\"N\":\"$AverageRating\"},\"ISBN\":{\"S\":\"$ISBN\"},\"NumPages\":{\"N\":\"$NumPages\"},\"Publisher\":{\"S\":\"$Publisher\"}}"  --profile "$AWS_PROFILE" --region "$AWS_REGION"

# done < bookdata.csv

# Loop through each line in the CSV file and put it into DynamoDB
while IFS=, read -r bookId Title Authors AverageRating ISBN NumPages Publisher
do
  # Check if AverageRating is a valid number
  if [[ ! $AverageRating =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
    echo "Invalid AverageRating value: $AverageRating"
    continue  # Skip the current iteration if AverageRating is invalid
  fi

  # Escape special characters in Title and Publisher
  EscapedTitle=$(echo "$Title" | sed 's/"/\\"/g')
  EscapedPublisher=$(echo "$Publisher" | sed 's/"/\\"/g')

  # Use AWS CLI to put each item into the DynamoDB table
  aws dynamodb put-item --table-name "$DYNAMODB_TABLE_NAME" --item "{\"bookId\":{\"S\":\"$bookId\"},\"Title\":{\"S\":\"$EscapedTitle\"},\"Authors\":{\"S\":\"$Authors\"},\"AverageRating\":{\"N\":\"$AverageRating\"},\"ISBN\":{\"S\":\"$ISBN\"},\"NumPages\":{\"N\":\"$NumPages\"},\"Publisher\":{\"S\":\"$EscapedPublisher\"}}"  --profile "$AWS_PROFILE" --region "$AWS_REGION"
done < bookdata.csv
