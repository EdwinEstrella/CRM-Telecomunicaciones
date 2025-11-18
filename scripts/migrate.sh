#!/bin/bash

echo "Running database migrations..."

cd backend
npm run migration:run

if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi

