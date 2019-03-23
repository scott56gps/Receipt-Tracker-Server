const format = require('pg-format')
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

function connectToDatabase(callback) {
    pool.connect(function (connectError, client, done) {
        if (connectError) {
            callback(connectError);
        }

        callback(null, client, done);
    });
}

function queryDatabase(query, client, callback) {
    // Query the Database
    client.query(query, function (queryError, queryResult) {
        if (queryError) {
            callback(queryError);
        }

        callback(null, queryResult)
    })
}

function getReceipts(callback) {
    // Create a query object
    var query = {
        text: 'SELECT id, vendor_name, date, total FROM receipt'
    }

    connectToDatabase((connectionError, client, done) => {
        if (connectionError) {
            callback(connectionError);
            return;
        }

        queryDatabase(query, client, (err, result) => {
            if (err) {
                done();
                callback(err);
                return;
            }

            // Release the db client
            done();
            callback(null, result.rows);
            return;
        })
    })
}

function getReceipt(receiptId, callback) {
    // Create a query object
    var query = {
        text: 'SELECT id, vendor_name, date, total FROM receipt WHERE id = $1',
        values: [receiptId]
    }

    connectToDatabase((connectionError, client, done) => {
        if (connectionError) {
            callback(connectionError);
            return;
        }

        queryDatabase(query, client, (err, result) => {
            if (err) {
                done();
                callback(err);
                return;
            }

            // Release the db client
            done();
            callback(null, result.rows[0]);
        })
    })
}

function createItems(items, client, done, callback) {
    // We shall create an array of arrays for the params.
    // The format is: [[name, quantity, amount], [name, quantity, amount]] == (name, quantity, amount), (name, quantity, amount)
    var values = [];
    // Iterate through the items
    items.forEach((item) => {
        values.push([item.name, item.quantity, item.amount]);
    });
    
    var query = format('INSERT INTO item (receipt_id, name, quantity, amount) VALUES %L', values);

    queryDatabase(query, client, (err) => {
        if (err) {
            done();
            callback(err);
            return;
        }

        done();
        callback(null)
        return;
    })
}

function createReceipt(receipt, callback) {
    var query = {
        text: 'INSERT INTO receipt (vendor_name, date, total) VALUES ($1, $2, $3) RETURNING *',
        values: [receipt.vendorName, receipt.date, receipt.total]
    }

    // Connect to the database
    connectToDatabase((connectionError, client, done) => {
        if (connectionError) {
            callback(connectionError);
            return;
        }

        queryDatabase(query, client, (err, receiptResponse) => {
            if (err) {
                callback(err);
                return;
            }
            
            if (receipt.items) {
                createItems(receipt.items, client, done, (itemsError) => {
                    if (itemsError) {
                        callback(err);
                        return;
                    }
    
                    // Release the db client
                    done();
                    return callback(null, receiptResponse.rows[0]);
                })
            } else {
                // Release the db client
                done();
                return callback(null, receiptResponse.rows[0]);
            }
        })
    })
}

module.exports = {
    getReceiptsModel: getReceipts,
    getReceiptModel: getReceipt,
    createReceipt: createReceipt
}