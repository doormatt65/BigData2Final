#!/bin/bash

AWS_PROFILE="default"
AWS_REGION="us-east-2"
DYNAMODB_TABLE_NAME="Test"

request_items=""
batch_size=25  # Adjust this batch size according to your needs

process_batch() {
  local items=$1
  local batch_request="{\"$DYNAMODB_TABLE_NAME\":[$items]}"
  echo "Initiating batch write operation..."
  echo "Processing batch: $batch_request"  # Logging the batch being processed
  aws dynamodb batch-write-item --request-items "$batch_request" --profile "$AWS_PROFILE" --region "$AWS_REGION"
}

counter=0

while IFS=, read -r ItemID Title Authors AverageRating ISBN NumPages Publisher
do
  if [[ ! $AverageRating =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
    echo "Invalid AverageRating value: $AverageRating"
    continue
  fi

  EscapedTitle=$(echo "$Title" | sed 's/"/\\"/g')
  EscapedPublisher=$(echo "$Publisher" | sed 's/"/\\"/g')

  request_items+="{\"PutRequest\":{\"Item\":{\"ItemID\":{\"S\":\"$ItemID\"},\"Title\":{\"S\":\"$EscapedTitle\"},\"Authors\":{\"S\":\"$Authors\"},\"AverageRating\":{\"N\":\"$AverageRating\"},\"ISBN\":{\"S\":\"$ISBN\"},\"NumPages\":{\"N\":\"$NumPages\"},\"Publisher\":{\"S\":\"$EscapedPublisher\"}}}},"

  ((counter++))

  if [ $counter -eq $batch_size ]; then
    # Process the batch
    process_batch "${request_items%,}"
    request_items=""
    counter=0
  fi
done < test.csv

# Process the remaining items if not a complete batch
if [ ${#request_items} -gt 0 ]; then
  process_batch "${request_items%,}"
fi
