#!/bin/bash

# Shell script to backup MongoDB databases or collections using mongodump

# Prompt the user for the database name
echo "Enter the database name: "
read -r database


# Configuration for MongoDB connection
DB_USERNAME="administrator"      # Replace with your MongoDB username
PASSWORD="ThisIsSecure"          # Replace with your MongoDB password
AUTH_DB="admin"                  # Authentication database
HOST="localhost"                 # MongoDB host
PORT="27017"                     # MongoDB port

# Define the backup directory with timestamp
TIMESTAMP=$(date +"%Y-%m-%d")
BACKUP_DIR="./backups/${TIMESTAMP}"

# Create the backup directory, if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Determine which collections to export

    # Perform the export
      mongodump \
        --host "$HOST" \
        --port "$PORT" \
        --db "$database" \
        --username "$DB_USERNAME" \
        --password "$PASSWORD" \
        --authenticationDatabase "$AUTH_DB" \
        --out "$BACKUP_DIR"

    # Check if the export was successful
    if [ $? -eq 0 ]; then
  echo "Successfully backed up the database to '$BACKUP_DIR'."
    else
  echo "Failed to back up the database. Check your MongoDB connection and permissions."
    fi

echo "Database backup has been completed."

# Optional: Compress the backup directory to save space
# Uncomment the following lines if you wish to compress the backup
# echo "Compressing the backup..."
# tar -czvf "${BACKUP_DIR}.tar.gz" -C "$(dirname "$BACKUP_DIR")" "$(basename "$BACKUP_DIR")"
# rm -rf "$BACKUP_DIR"
# echo "Backup compressed to '${BACKUP_DIR}.tar.gz'. Original backup directory removed."