const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

// Send in the Controllers!
const receiptController = require('./controllers/receipt-controller');

// Set up JSON body parsing
app.use(express.json());
app.use(logRequest);

app.get('/receipts', receiptController.handleGetReceipts);
app.get('/receipt/:id', receiptController.handleGetReceipt);

app.post('/receipt', receiptController.handlePostReceipt);
app.put('/receipt/:id', receiptController.handleUpdateReceipt);

app.delete('/receipt/:id', receiptController.handleDeleteReceipt);

// Middleware
function logRequest(request, response, next) {
    console.log('Received ' + request.method + ' request for: ' + request.url);
    next();
}

app.listen(port, function () {
    console.log('Server now listening on port ' + port);
})