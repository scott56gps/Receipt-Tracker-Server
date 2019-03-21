const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

function queryDatabase(query, callback) {
    // Connect to the database by checking out a client
    pool.connect(function (connectError, client, done) {
        if (connectError) {
            callback(connectError);
        }

        // Query the Database
        client.query(query, function (queryError, queryResult) {
            // Release the client from the pool, since we just used it and we
            //  have no need for it at the current moment.
            done();

            if (queryError) {
                callback(queryError);
            }

            callback(null, queryResult)
        })
    })
}

function getReceipts(callback) {
    // Create a query object
    var query = {
        text: 'SELECT id, vendor_name, date, total FROM receipt'
    }

    queryDatabase(query, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result.rows);
    })
}

function getReceipt(receiptId, callback) {
    // Create a query object
    var query = {
        text: 'SELECT id, vendor_name, date, total FROM receipt WHERE id = $1',
        values: [receiptId]
    }

    queryDatabase(query, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, result.rows[0]);
    })
}

function createOneReceipt(vendorName, date, total, items, callback) {
    var query = {
        text: 'INSERT INTO receipt (vendor_name, date, total) VALUES ($1, $2, $3) RETURNING *',
        values: [vendorName, date, total]
    }

    queryDatabase(query, (err, result) => {
        if (err) {
            callback(err);
            return;
        }

        
        if (items) {
            // Iteraate through the items
            items.forEach((item) => {
                
            })
            query = {
                text: 'INSERT INTO receipt (vendor_name, date, total) VALUES ($1, $2, $3) RETURNING *',
                values: [vendorName, date, total]
            }
        }

        callback(null, )
    })
}

module.exports = {
    getReceiptsModel: getReceipts,
    getReceiptModel: getReceipt
}