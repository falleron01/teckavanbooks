FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip sqlite3 libsqlite3-dev \
    && docker-php-ext-install zip pdo pdo_sqlite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /workspaces/teckavanbooks