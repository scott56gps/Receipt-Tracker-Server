DROP TABLE IF EXISTS parent_child, person;

CREATE TABLE receipt (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    date DATE,
    total NUMERIC(10, 2)
);

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipt(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity INTEGER,
    amount NUMERIC(10, 2)
);

INSERT INTO receipt (vendor_name, date, total) VALUES (
    'Walmart',
    '2019-01-13',
    23.43
), (
    'WinCo',
    '2019-02-23',
    89.65
), (
    'Walmart',
    '2019-02-11',
    55.23
);

INSERT INTO item (receipt_id, name, quantity, amount) VALUES (
    1,
    'Soap',
    2,
    7.85
);