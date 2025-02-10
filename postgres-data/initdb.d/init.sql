CREATE DATABASE ghost_exchange;

\c ghost_exchange;

CREATE TYPE transaction_type AS ENUM ('DEPOSIT','WITHDRAW');

CREATE  TABLE account ( 
	fiat_balance         numeric(18,2)  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	email                varchar(100)  NOT NULL  ,
	username             varchar(100)  NOT NULL  ,
	pwd                  varchar(256)  NOT NULL  ,
	account_role         varchar(255)  NOT NULL  ,
	fcm_token            varchar(255)    ,
	CONSTRAINT account_pkey PRIMARY KEY ( id ),
	CONSTRAINT account_username_key UNIQUE ( username ) 
 );

ALTER TABLE account ADD CONSTRAINT account_account_role_check CHECK ( ((account_role)::text = ANY ((ARRAY['CLIENT'::character varying, 'ADMIN'::character varying])::text[])) );

CREATE  TABLE commission ( 
	purchases_commission numeric(10,2)  NOT NULL  ,
	sales_commission     numeric(10,2)  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	CONSTRAINT commission_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE cryptocurrency ( 
	fiat_price           numeric(18,2)  NOT NULL  ,
	symbol               varchar(3)  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	name                 varchar(50)  NOT NULL  ,
	CONSTRAINT cryptocurrency_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE cryptocurrency_favorite ( 
	account_id           bigint  NOT NULL  ,
	add_timestamp        timestamp    ,
	cryptocurrency_id    bigint  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	CONSTRAINT cryptocurrency_favorite_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE cryptocurrency_wallet ( 
	balance              numeric(18,2) DEFAULT 0 NOT NULL  ,
	cryptocurrency_id    bigint  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	user_id              bigint  NOT NULL  ,
	CONSTRAINT cryptocurrency_wallet_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE sell_order ( 
	amount               numeric(18,12)  NOT NULL  ,
	fiat_price           numeric(18,2)  NOT NULL  ,
	is_open              boolean DEFAULT true NOT NULL  ,
	sales_commission     numeric(10,2)  NOT NULL  ,
	cryptocurrency_id    bigint  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	seller_id            bigint    ,
	"timestamp"          timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT sell_order_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE "transaction" ( 
	amount               numeric(18,2)  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	"timestamp"          timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	user_id              bigint  NOT NULL  ,
	validation_timestamp timestamp    ,
	transaction_type     varchar(255)  NOT NULL  ,
	CONSTRAINT transaction_pkey PRIMARY KEY ( id )
 );

ALTER TABLE "transaction" ADD CONSTRAINT transaction_transaction_type_check CHECK ( ((transaction_type)::text = ANY ((ARRAY['DEPOSIT'::character varying, 'WITHDRAW'::character varying])::text[])) );

CREATE  TABLE xe_history ( 
	fiat_price           numeric(18,2)  NOT NULL  ,
	cryptocurrency_id    bigint  NOT NULL  ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	"timestamp"          timestamp  NOT NULL  ,
	"version"            bigint  NOT NULL  ,
	CONSTRAINT xe_history_pkey PRIMARY KEY ( id )
 );

CREATE  TABLE ledger ( 
	purchases_commission numeric(10,2)  NOT NULL  ,
	buyer_id             bigint    ,
	id                   bigint  NOT NULL GENERATED  BY DEFAULT AS IDENTITY ,
	sell_order_id        bigint  NOT NULL  ,
	"timestamp"          timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL  ,
	CONSTRAINT ledger_pkey PRIMARY KEY ( id )
 );

ALTER TABLE cryptocurrency_favorite ADD CONSTRAINT fklhe0j4hjdtrcbk15g1q77n751 FOREIGN KEY ( cryptocurrency_id ) REFERENCES cryptocurrency( id );

ALTER TABLE cryptocurrency_favorite ADD CONSTRAINT fkfsmamgg35o8hnqvp7ki91xclc FOREIGN KEY ( account_id ) REFERENCES account( id );

ALTER TABLE cryptocurrency_wallet ADD CONSTRAINT fka4hed0m319m0c4gcu36vvcv5i FOREIGN KEY ( user_id ) REFERENCES account( id );

ALTER TABLE cryptocurrency_wallet ADD CONSTRAINT fk7tqffhvsnt0et87r61u979f4j FOREIGN KEY ( cryptocurrency_id ) REFERENCES cryptocurrency( id );

ALTER TABLE ledger ADD CONSTRAINT fk3re10ywa7loo9g7mwnsjwis6o FOREIGN KEY ( sell_order_id ) REFERENCES sell_order( id );

ALTER TABLE ledger ADD CONSTRAINT fkq4m7mohjx1h0ts7hdcxu4gyu7 FOREIGN KEY ( buyer_id ) REFERENCES account( id );

ALTER TABLE sell_order ADD CONSTRAINT fk1biayw8dnjcvby12eornr40rh FOREIGN KEY ( seller_id ) REFERENCES account( id );

ALTER TABLE sell_order ADD CONSTRAINT fkh6dbua3bd0yxlcwawl6xmb2um FOREIGN KEY ( cryptocurrency_id ) REFERENCES cryptocurrency( id );

ALTER TABLE "transaction" ADD CONSTRAINT fkciv7m3tj7bapjy1f6i0h90ge2 FOREIGN KEY ( user_id ) REFERENCES account( id );

ALTER TABLE xe_history ADD CONSTRAINT fkoaixejc57w876fgqukrc34cr9 FOREIGN KEY ( cryptocurrency_id ) REFERENCES cryptocurrency( id );