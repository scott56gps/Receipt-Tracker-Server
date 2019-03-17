const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

function getReceipts(callback) {
    // Connect to the database by checking out a client
    pool.connect(function (error, client, done) {
        if (error) {
            callback(error);
        }

        // Create a query object
        var query = {
            text: 'SELECT id, vendor_name, date, total FROM receipt'
        }

        // Query the Database
        client.query(query, function (err, queryResult) {
            // Release the client from the pool, since we just used it and we
            //  have no need for it at the current moment.
            done();

            if (err) {
                callback(err);
            }

            callback(null, queryResult.rows)
        })
    })
}

module.exports = {
    getReceiptsModel: getReceipts
}