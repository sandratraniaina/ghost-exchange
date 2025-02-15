CREATE DATABASE anonymizer;

\c anonymizer;

CREATE TABLE gender(
   gender_id SERIAL,
   name VARCHAR(20)  NOT NULL,
   PRIMARY KEY(gender_id),
   UNIQUE(name)
);

CREATE TABLE person(
   person_id SERIAL,
   first_name VARCHAR(100)  NOT NULL,
   last_name VARCHAR(100) ,
   date_of_birth DATE NOT NULL,
   gender_id INTEGER NOT NULL,
   PRIMARY KEY(person_id),
   FOREIGN KEY(gender_id) REFERENCES gender(gender_id)
);

CREATE TABLE account(
   account_id SERIAL,
   is_validated BOOLEAN DEFAULT false,
   username VARCHAR(100)  NOT NULL,
   email VARCHAR(100)  NOT NULL,
   password VARCHAR(256)  NOT NULL,
   attempts SMALLINT NOT NULL DEFAULT 3,
   pin CHAR(6) ,
   expiration_date TIMESTAMP,
   person_id INTEGER NOT NULL,
   PRIMARY KEY(account_id),
   UNIQUE(person_id),
   UNIQUE(username),
   UNIQUE(email),
   FOREIGN KEY(person_id) REFERENCES person(person_id)
);

INSERT INTO gender(name) VALUES ('male'), ('female');