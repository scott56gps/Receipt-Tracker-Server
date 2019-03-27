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

        queryDatabase(query, client, (receiptErr, receiptResult) => {
            if (receiptErr) {
                done();
                callback(err);
                return;
            }

            // Create receipt with result data
            var receipt = receiptResult.rows[0];

            // Get the items
            query = {
                text: 'SELECT name, quantity, amount FROM item WHERE receipt_id = $1',
                values: [receiptId]
            }

            queryDatabase(query, client, (itemsError, itemsResult) => {
                if (itemsError) {
                    done();
                    callback(itemsError);
                    return;
                }

                receipt.items = itemsResult.rows

                done();
                callback(null, receipt);
            })
        })
    })
}

function createItems(receiptId, items, client, callback) {
    // We shall create an array of arrays for the params.
    // The format is: [[name, quantity, amount], [name, quantity, amount]] == (name, quantity, amount), (name, quantity, amount)
    var values = [];
    // Iterate through the items
    items.forEach((item) => {
        values.push([receiptId, item.name, item.quantity, item.amount]);
    });
    
    var query = format('INSERT INTO item (receipt_id, name, quantity, amount) VALUES %L', values);

    queryDatabase(query, client, (err) => {
        if (err) {
            callback(err);
            return;
        }

        callback();
        return;
    })
}

function createReceipt(receipt, callback) {
    var query = {
        text: 'INSERT INTO receipt (vendor_name, date, total) VALUES ($1, $2, $3) RETURNING id, vendor_name, date, total',
        values: [receipt.vendorName, receipt.date, receipt.total]
    }

    // Connect to the database
    connectToDatabase((connectionError, client, done) => {
        if (connectionError) {
            done()
            callback(connectionError);
            return;
        }

        queryDatabase(query, client, (err, receiptResponse) => {
            if (err) {
                done()
                callback(err);
                return;
            }

            done()
            
            if (receipt.items) {
                createItems(receiptResponse.rows[0].id, receipt.items, client, (itemsError) => {
                    if (itemsError) {
                        done();
                        callback(err);
                        return;
                    }
    
                    // Release the db client
                    done();
                    callback(null, receiptResponse.rows[0]);
                })
            } else {
                callback(null, receiptResponse.rows[0]);
            }
        })
    })
}

/**
 * UPDATE RECEIPT
 * Updates the receipt in the database with the corresponding passed in receipt.
 * 
 * @param {ReceiptDTO} receipt The object with which to update the database for.  Must include a valid
 * Database id for an existing receipt.
 * @param {Function} callback The function to call with the updated receipt
 */
function updateReceipt(receipt, callback) {
    connectToDatabase((connectionError, client, done) => {
        if (connectionError) {
            callback(connectionError)
            return;
        }

        var query = {
            text: 'UPDATE receipt SET vendor_name = $1, date = $2, total = $3 WHERE id = $4 RETURNING id, vendor_name, date, total',
            values: [receipt.vendorName, receipt.date, receipt.total, receipt.id]
        }

        queryDatabase(query, client, (err, receiptResponse) => {
            if (err) {
                callback(err)
                return;
            }

            done()
            callback(null, receiptResponse.rows[0])
        })
    })
}

module.exports = {
    getReceiptsModel: getReceipts,
    getReceiptModel: getReceipt,
    createReceipt: createReceipt,
    updateReceipt: updateReceipt
}