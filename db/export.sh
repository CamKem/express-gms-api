#!/bin/bash

# Shell script to export MongoDB collections to their respective JSON files using mongoexport

# Prompt the user for the database name
echo "Enter the database name: "
read -r database

# Prompt the user for the collection name, or enter 'all' to dump the entire database
echo "Enter the collection name (or 'all' to dump the entire database): "
read -r collection_input

# Configuration for MongoDB connection
DB_USERNAME="administrator"
PASSWORD="ThisIsSecure"
AUTH_DB="admin"
HOST="localhost"
PORT="27017"

# Define the output directory
TIMESTAMP=$(date +"%Y-%m-%d")
OUTPUT_DIR="./exports/$TIMESTAMP/$database"

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to retrieve collections when 'all' is selected
get_all_collections() {
  mongosh --quiet --username "$DB_USERNAME" --password "$PASSWORD" --authenticationDatabase "$AUTH_DB" --eval "db.getSiblingDB('$database').getCollectionNames().forEach(c => print(c))" "$database"
}

# Determine which collections to export
if [ "$collection_input" = "all" ]; then
  echo "Fetching all collections from the '$database' database..."
  collections=$(get_all_collections)

  # Check if any collections were retrieved
  if [ -z "$collections" ]; then
    echo "No collections found in the database '$database'. Exiting."
    exit 1
  fi
else
  collections="$collection_input"
fi

# Export each collection
for collection in $collections; do
  # Trim any leading/trailing whitespace
  clean_collection=$(echo "$collection" | xargs)

  # Skip if the collection name is empty after cleaning
  if [ -n "$clean_collection" ]; then
    echo "Exporting collection: $clean_collection"

    # Define the output file path
    output_file="$OUTPUT_DIR/${clean_collection}.json"

    # Perform the export
    mongoexport \
      --host "$HOST" \
      --port "$PORT" \
      --db "$database" \
      --username "$DB_USERNAME" \
      --password "$PASSWORD" \
      --authenticationDatabase "$AUTH_DB" \
      --collection "$clean_collection" \
      --out "$output_file" \
      --jsonArray

    # Check if the export was successful
    if [ $? -eq 0 ]; then
      echo "Successfully exported '$clean_collection' to '$output_file'."
    else
      echo "Failed to export '$clean_collection'. Check your MongoDB connection and permissions."
    fi
  fi
done

echo "All specified collections have been processed."