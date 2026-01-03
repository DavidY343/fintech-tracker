-- Tipos de datos utilizados en este schema:
-- TIMESTAMP WITH TIME ZONE (TIMESTAMPTZ) para fechas con zona horaria
-- NUMERIC(15,6) para valores monetarios con 6 decimales
-- BIGSERIAL para IDs autoincrementales grandes
-- BOOLEAN DEFAULT TRUE para flags activos/inactivos

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE accounts (
    account_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_category_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_parent_category
        FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

CREATE TABLE transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    category_id BIGINT,
    date TIMESTAMPTZ NOT NULL,
    amount NUMERIC(15,6) NOT NULL,
    type VARCHAR(10) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id) REFERENCES accounts(account_id),

    CONSTRAINT fk_transaction_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id),

    CONSTRAINT chk_transaction_type
        CHECK (type IN ('income', 'expense'))
);

CREATE TABLE asset_types (
    asset_type_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE assets (
    asset_id BIGSERIAL PRIMARY KEY,
    ticker VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    asset_type_id BIGINT NOT NULL,
    currency CHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_asset_type
        FOREIGN KEY (asset_type_id)
        REFERENCES asset_types(asset_type_id)
);


CREATE TABLE themes (
    theme_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_theme_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_parent_theme
        FOREIGN KEY (parent_theme_id)
        REFERENCES themes(theme_id)
);

CREATE TABLE asset_theme (
    asset_id BIGINT NOT NULL,
    theme_id BIGINT NOT NULL,

    PRIMARY KEY (asset_id, theme_id),

    CONSTRAINT fk_asset_theme_asset
        FOREIGN KEY (asset_id) REFERENCES assets(asset_id),

    CONSTRAINT fk_asset_theme_theme
        FOREIGN KEY (theme_id) REFERENCES themes(theme_id)
);

CREATE TABLE operations (
    operation_id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    quantity NUMERIC(15,6) NOT NULL,
    price NUMERIC(15,6) NOT NULL,
    fees NUMERIC(15,6) DEFAULT 0,
    operation_type VARCHAR(10) NOT NULL,

    CONSTRAINT fk_operation_asset
        FOREIGN KEY (asset_id) REFERENCES assets(asset_id),

    CONSTRAINT fk_operation_account
        FOREIGN KEY (account_id) REFERENCES accounts(account_id),

    CONSTRAINT chk_operation_type
        CHECK (operation_type IN ('buy', 'sell'))
);

CREATE TABLE price_history (
    price_id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    price NUMERIC(15,6) NOT NULL,

    CONSTRAINT fk_price_asset
        FOREIGN KEY (asset_id) REFERENCES assets(asset_id),

    CONSTRAINT uq_asset_date UNIQUE (asset_id, date)
);

CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);

CREATE INDEX idx_operations_asset ON operations(asset_id);
CREATE INDEX idx_operations_account ON operations(account_id);

CREATE INDEX idx_price_asset_date ON price_history(asset_id, date);
