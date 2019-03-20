const receiptModels = require('../models/receipt-models');

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

module.exports = {
    handleGetReceipts: getReceipts,
    handleGetReceipt: getReceipt
}