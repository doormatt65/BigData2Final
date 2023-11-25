#!/bin/bash

AWS_PROFILE="default"
AWS_REGION="us-east-2"
DYNAMODB_TABLE_NAME="Table"

request_items=""
batch_size=25  # Adjust this batch size according to your needs

process_batch() {
  local items=$1
  local batch_request="{\"$DYNAMODB_TABLE_NAME\":$items}"
  echo "Initiating batch write operation..."
  aws dynamodb batch-write-item --request-items "$batch_request" --profile "$AWS_PROFILE" --region "$AWS_REGION"
}

counter=0
skipped_items=0
processed_items=0

while IFS=, read -r GroupID ItemID Title Authors Rating ISBN PageCount Publisher
do
  if [[ ! $Rating =~ ^[0-9]+(\.[0-9]+)?$ || ! $PageCount =~ ^[0-9]+$ || -z $GroupID || -z $ItemID ]]; then
    echo "Skipping invalid item: $GroupID - $ItemID (Invalid Rating: $Rating or PageCount: $PageCount)"
    ((skipped_items++))
    continue
  fi

  EscapedTitle=$(echo "$Title" | sed 's/"/\\"/g')
  EscapedAuthors=$(echo "$Authors" | sed 's/"/\\"/g')
  EscapedPublisher=$(echo "$Publisher" | sed 's/"/\\"/g')

  request_items+="{\"PutRequest\":{\"Item\":{\"GroupID\":{\"N\":\"$GroupID\"},\"ItemID\":{\"N\":\"$ItemID\"},\"Title\":{\"S\":\"$EscapedTitle\"},\"Authors\":{\"S\":\"$EscapedAuthors\"},\"Rating\":{\"N\":\"$Rating\"},\"ISBN\":{\"S\":\"$ISBN\"},\"PageCount\":{\"N\":\"$PageCount\"},\"Publisher\":{\"S\":\"$EscapedPublisher\"}}}},"

  ((counter++))
  ((processed_items++))

  if [ $counter -eq $batch_size ]; then
    # Process the batch
    process_batch "[${request_items%,}]"
    request_items=""
    counter=0
  fi
done < bookdata.csv

# Process the remaining items if not a complete batch
if [ ${#request_items} -gt 0 ]; then
  process_batch "[${request_items%,}]"
  ((processed_items+=$((counter - 1))))
fi

echo "Total processed items: $processed_items"
echo "Total skipped items: $skipped_items"
