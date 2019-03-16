DROP TABLE IF EXISTS parent_child, person;

CREATE TABLE receipt (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    date DATE,
    total FLOAT(10, 2)
);

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipt(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity INTEGER,
    amount FLOAT(10, 2)
);

INSERT INTO receipt (first_name, last_name, birth_date) VALUES (
    'Nellie',
    'Nicholes',
    '1993-12-11'
), (
    'Scott',
    'Nicholes',
    '1993-08-09'
), (
    'Echo',
    'Nicholes',
    '2019-01-13'
);

INSERT INTO parent_child (parent_id, child_id) VALUES (
    1,
    3
), (
    2,
    3
);