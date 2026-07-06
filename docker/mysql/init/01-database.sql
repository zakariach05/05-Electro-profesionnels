-- Docker initialisation script for Electro-05
-- Runs only on first container start

CREATE DATABASE IF NOT EXISTS `05_electro`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Application user (created by MYSQL_USER env var, but ensure permissions)
GRANT ALL PRIVILEGES ON `05_electro`.* TO 'electro'@'%';
FLUSH PRIVILEGES;
