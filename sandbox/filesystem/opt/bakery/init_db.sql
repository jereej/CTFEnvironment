-- Les Baguettes Inventory Database
-- Initialize with sample data

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL,
    category TEXT
);

CREATE TABLE IF NOT EXISTS secret_config (
    key TEXT PRIMARY KEY,
    value TEXT
);

INSERT INTO customers VALUES
(1, 'Jean Dupont', 'jean@example.com', '+33 1 23 45 67 89', 'Regular customer, prefers baguettes'),
(2, 'Marie Laurent', 'marie@example.com', '+33 1 98 76 54 32', 'Allergic to nuts'),
(3, 'Cafe du Coin', 'contact@cafecoin.fr', '+33 1 11 22 33 44', 'Wholesale customer - daily delivery'),
(4, 'Philippe Martin', 'philippe@example.com', '+33 1 55 66 77 88', 'VIP customer'),
(5, 'Admin', 'admin@lesbaguettes.com', 'INTERNAL', 'BAGUETTE{sql_data_extracted}');

INSERT INTO products VALUES
(1, 'Baguette Traditional', 2.50, 'bread'),
(2, 'Pain de Campagne', 3.50, 'bread'),
(3, 'Croissant', 1.80, 'pastry'),
(4, 'Pain au Chocolat', 2.00, 'pastry'),
(5, 'Tarte aux Pommes', 4.50, 'dessert');

INSERT INTO secret_config VALUES
('db_password', 'super_secret_123'),
('api_key', 'sk_live_baguette_12345');
