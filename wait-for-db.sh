#!/bin/bash

echo "Waiting for database to be ready..."
while ! mysqladmin ping -h "$DB_HOST" --silent; do
  sleep 1
done
echo "Database is ready!"

exec "$@"
