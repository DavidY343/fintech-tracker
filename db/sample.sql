INSERT INTO users (email, password_hash)
VALUES ('demo@user.com', 'hashed_password');

INSERT INTO accounts (user_id, name, type, currency)
VALUES
(1, 'Cuenta Bancaria', 'bank', 'EUR'),
(1, 'Broker Principal', 'broker', 'EUR');

INSERT INTO categories (name)
VALUES ('Alimentación'), ('Transporte'), ('Ocio');

INSERT INTO categories (name, parent_category_id)
VALUES ('Supermercado', 1);

INSERT INTO transactions (account_id, category_id, date, amount, type, description)
VALUES
(1, 4, NOW() - INTERVAL '2 days', 75.50, 'expense', 'Compra supermercado'),
(1, 2, NOW() - INTERVAL '5 days', 40.00, 'expense', 'Gasolina'),
(1, NULL, NOW() - INTERVAL '10 days', 1500.00, 'income', 'Nómina');

INSERT INTO asset_types (name)
VALUES ('stock'), ('etf'), ('fund');

INSERT INTO assets (ticker, name, asset_type_id, currency)
VALUES
('AAPL', 'Apple Inc.', 1, 'USD'),
('VWCE', 'Vanguard FTSE All-World ETF', 2, 'EUR'),
(NULL, 'Fondo Indexado Global', 3, 'EUR');

INSERT INTO themes (name)
VALUES ('Global Equity'), ('Tech'), ('Fixed Income');

INSERT INTO themes (name, parent_theme_id)
VALUES ('Technology', 1);

INSERT INTO asset_theme (asset_id, theme_id)
VALUES
(1, 2), -- Apple -> Tech
(2, 1), -- VWCE -> Global Equity
(3, 1);

INSERT INTO operations (asset_id, account_id, date, quantity, price, operation_type)
VALUES
(1, 2, NOW() - INTERVAL '30 days', 10, 150, 'buy'),
(2, 2, NOW() - INTERVAL '20 days', 5, 100, 'buy'),
(3, 2, NOW() - INTERVAL '15 days', 20, 50, 'buy');

INSERT INTO price_history (asset_id, date, price)
VALUES
(1, CURRENT_DATE, 170),
(2, CURRENT_DATE, 110),
(3, CURRENT_DATE, 52);

