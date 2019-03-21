const receiptModels = require('../models/receipt-model');

function getReceipts(request, response) {
    receiptModels.getReceiptsModel(function (err, receipts) {
        if (err) {
            console.error(err);
            return;
        }

        response.json(receipts);
    })
}

function getReceipt(request, response) {
    var requestId = request.params.id;
    receiptModels.getReceiptModel(requestId, function (err, receipt) {
        if (err) {
            console.error(err);
            return;
        }

        response.json(receipt);
    })
}

function postReceipt(request, response) {
    // Parse the variables from the POST request body
    var vendorName = request.body.vendorName;
    var date = request.body.date;
    var total = request.body.total;
    var items = request.body.items;

    // Command the Model to create a new receipt in the database
    var receiptDto = {
        vendorName: vendorName,
        date: date,
        total: total,
        items: items
    }

    receiptModels.createReceipt(receiptDto, (err, receipt) => {
        if (err) {
            console.error(err);
            return;
        }

        response.json(receipt);
    })
}

module.exports = {
    handleGetReceipts: getReceipts,
    handleGetReceipt: getReceipt,
    handlePostReceipt: postReceipt
}