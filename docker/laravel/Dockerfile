ARG APP_ENV=local

# ─── Base stage ──────────────────────────────────────────────
FROM php:8.2-fpm-alpine AS base

ARG UID=1000
ARG GID=1000

ENV PHP_OPCACHE_ENABLE=1

RUN apk add --no-cache \
    curl \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    autoconf \
    g++ \
    make \
    nss_wrapper \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    mysqli \
    gd \
    bcmath \
    opcache \
    zip \
    mbstring \
    exif \
    pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/cache/apk/* /tmp/*

RUN apk add --no-cache su-exec

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP configuration (from project root context)
COPY docker/laravel/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/laravel/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/laravel/fpm.conf /usr/local/etc/php-fpm.d/fpm.conf

# Create user
RUN addgroup -g ${GID} electro \
    && adduser -D -u ${UID} -G electro electro

WORKDIR /var/www

# ─── Vendor stage (composer install) ─────────────────────────
FROM base AS vendor

# Copy only composer files first for layer caching
COPY Back-end/composer.json Back-end/composer.lock /var/www/
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    && composer clear-cache -q

COPY Back-end/ /var/www/
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --prefer-dist \
    && composer dump-autoload --optimize

# ─── Production stage ────────────────────────────────────────
FROM base AS production

COPY --from=vendor --chown=electro:electro /var/www /var/www

RUN php artisan optimize \
    && php artisan event:cache \
    && php artisan route:cache \
    && php artisan view:cache

COPY docker/laravel/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]

# ─── Local development stage ─────────────────────────────────
FROM base AS development

COPY Back-end/ /var/www/

RUN composer install --no-interaction --prefer-dist

RUN mkdir -p /var/www/storage/app/public \
    /var/www/storage/framework/cache \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY docker/laravel/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["entrypoint.sh"]
