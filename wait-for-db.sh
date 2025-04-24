#!/bin/bash

# check if DB_HOST is set
if [ -z "$DB_HOST" ]; then
  echo "DB_HOST is not set. Setting it to \"sensareal-database\"."
  export DB_HOST="sensareal-database"
fi

echo "Waiting for database to be ready..."
while ! mysqladmin ping -h "$DB_HOST" --silent; do
  sleep 1
done
echo "Database is ready!"

exec "$@"
