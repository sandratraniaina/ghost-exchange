SET check_function_bodies = false
;

CREATE TYPE transaction_type AS ENUM (
   'DEBIT',   
   'CREDIT',  
   'TRANSFER',
   'REFUND'  
);

CREATE TABLE account(
  id serial NOT NULL,
  fiat_balance numeric(18, 2) NOT NULL,
  username varchar(100) NOT NULL UNIQUE,
  email varchar(100) NOT NULL,
  CONSTRAINT account_pkey PRIMARY KEY(id)
);

CREATE TABLE commission(
  id serial NOT NULL,
  sales_commission numeric(10,2) NOT NULL,
  purchases_commission numeric(10,2) NOT NULL,
  CONSTRAINT commission_pkey PRIMARY KEY(id)
);

CREATE TABLE cryptocurrency(
  id serial NOT NULL,
  "name" varchar(50) NOT NULL,
  symbol varchar(3) NOT NULL,
  fiat_price numeric(18, 2) NOT NULL,
  CONSTRAINT cryptocurrency_pkey PRIMARY KEY(id)
);

CREATE TABLE cryptocurrency_favorite(
  id integer NOT NULL,
  add_timestamp timestamp,
  account_id integer NOT NULL,
  cryptocurrency_id integer NOT NULL,
  CONSTRAINT cryptocurrency_favorite_pkey PRIMARY KEY(id)
);

CREATE TABLE cryptocurrency_wallet(
  id serial NOT NULL,
  user_id integer NOT NULL,
  cryptocurrency_id integer NOT NULL,
  balance numeric(18, 2) NOT NULL DEFAULT 0,
  CONSTRAINT cryptocurrency_wallet_pkey PRIMARY KEY(id)
);

CREATE TABLE ledger(
  id serial NOT NULL,
  sell_order_id integer NOT NULL,
  buyer_id integer NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sales_commission numeric(10,2) NOT NULL,
  purchases_commission numeric(10,2) NOT NULL,
  CONSTRAINT ledger_pkey PRIMARY KEY(id)
);

CREATE TABLE sell_order(
  id serial NOT NULL,
  seller_id integer NOT NULL,
  cryptocurrency_id integer NOT NULL,
  amount numeric(18, 12) NOT NULL,
  fiat_price numeric(18, 2) NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_open bool NOT NULL DEFAULT true,
  CONSTRAINT sell_order_pkey PRIMARY KEY(id)
);

CREATE TABLE "transaction"(
  id serial NOT NULL,
  user_id integer NOT NULL,
  amount numeric(18, 2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  "timestamp" timestamp NOT NULL,
  validation_timestamp timestamp DEFAULT NULL,
  CONSTRAINT transaction_pkey PRIMARY KEY(id)
);

CREATE TABLE xe_history(
  id serial NOT NULL,
  cryptocurrency_id integer NOT NULL,
  fiat_price numeric(18, 2) NOT NULL,
  "timestamp" timestamp NOT NULL,
  CONSTRAINT xe_history_pkey PRIMARY KEY(id)
);

ALTER TABLE ledger
  ADD CONSTRAINT ledger_sell_order_id_fkey
    FOREIGN KEY (sell_order_id) REFERENCES sell_order (id);

ALTER TABLE sell_order
  ADD CONSTRAINT sell_order_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES account (id);

ALTER TABLE ledger
  ADD CONSTRAINT ledger_buyer_id_fkey
    FOREIGN KEY (buyer_id) REFERENCES account (id);

ALTER TABLE sell_order
  ADD CONSTRAINT sell_order_cryptocurrency_id_fkey
    FOREIGN KEY (cryptocurrency_id) REFERENCES cryptocurrency (id);

ALTER TABLE "transaction"
  ADD CONSTRAINT transaction_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES account (id);

ALTER TABLE cryptocurrency_wallet
  ADD CONSTRAINT cryptocurrency_wallet_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES account (id);

ALTER TABLE cryptocurrency_wallet
  ADD CONSTRAINT cryptocurrency_wallet_cryptocurrency_id_fkey
    FOREIGN KEY (cryptocurrency_id) REFERENCES cryptocurrency (id);

ALTER TABLE xe_history
  ADD CONSTRAINT xe_history_cryptocurrency_id_fkey
    FOREIGN KEY (cryptocurrency_id) REFERENCES cryptocurrency (id);

ALTER TABLE cryptocurrency_favorite
  ADD CONSTRAINT cryptocurrency_favorite_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES account (id);

ALTER TABLE cryptocurrency_favorite
  ADD CONSTRAINT cryptocurrency_favorite_cryptocurrency_id_fkey
    FOREIGN KEY (cryptocurrency_id) REFERENCES cryptocurrency (id);
