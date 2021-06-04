#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -- <<-EOSQL
    CREATE TABLE "audits" (
        id serial primary key,
        name varchar(100) not null,
        values varchar(100)
    );
EOSQL
