const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

// Send in the Controllers!
const receiptController = require('./controllers/receipt-controller');

// Set up JSON body parsing
app.use(express.json());

app.get('/receipts', receiptController.handleGetReceipts);
app.get('/receipt/:id', receiptController.handleGetReceipt);

app.post('/receipt', receiptController.handlePostReceipt);

app.listen(port, function () {
    console.log('Server now listening on port ' + port);
})