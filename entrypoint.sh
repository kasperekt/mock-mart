#!/bin/sh
set -e

until mariadb-admin ping --skip-ssl -h db -P 3306 \
      -u "$MYSQL_USER" --password="$MYSQL_PASSWORD"
do
  echo "🔄 Waiting for MySQL…"
  sleep 1
done

# Check if PURGE_DB flag is set to true
if [ "$PURGE_DB" = "true" ]; then
  echo "🗑️  PURGE_DB flag detected - Purging database..."
  
  # Drop the database if it exists (using mariadb with SSL disabled)
  mariadb -h db -P 3306 -u "$MYSQL_USER" --password="$MYSQL_PASSWORD" --skip-ssl \
    -e "DROP DATABASE IF EXISTS \`$MYSQL_DATABASE\`;" 2>/dev/null || true
  
  # Recreate the database (using mariadb with SSL disabled)
  mariadb -h db -P 3306 -u "$MYSQL_USER" --password="$MYSQL_PASSWORD" --skip-ssl \
    -e "CREATE DATABASE \`$MYSQL_DATABASE\`;"
  
  echo "✅ Database purged and recreated"
else
  echo "📊 Using existing database (PURGE_DB not set or false)"
fi

echo "🔃 Running migrations"
npx drizzle-kit migrate

echo "🔃 Running Server"
node server.js