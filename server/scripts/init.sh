#!/bin/sh

echo "Aplying migrations..."
until nc -z -v -w30 db 5432
do
  echo "Waiting for database connection..."
  # wait for 10 seconds before retrying
  sleep 10
done

npm run migration

echo "Iniciando o servidor..."
npm run dev