#!/bin/sh
set -e

until mariadb-admin ping --skip-ssl -h db -P 3306 \
      -u "$MYSQL_USER" --password="$MYSQL_PASSWORD"
do
  echo "🔄 Waiting for MySQL…"
  sleep 1
done

echo "🔃 Running migrations"
npx drizzle-kit migrate

echo "🔃 Running Server"
node server.js