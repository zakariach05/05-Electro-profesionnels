#!/bin/sh
set -e

# Create storage directories
for dir in storage/app/public storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache; do
    mkdir -p "/var/www/$dir"
done

# Set permissions
chown -R electro:electro /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Create storage symlink if it doesn't exist
if [ ! -L /var/www/public/storage ]; then
    php /var/www/artisan storage:link --force 2>/dev/null || true
fi

# Run migrations in dev
if [ "${APP_ENV}" = "local" ] || [ "${APP_ENV}" = "development" ]; then
    php /var/www/artisan migrate --force 2>/dev/null || true
fi

exec su-exec electro php-fpm -F
