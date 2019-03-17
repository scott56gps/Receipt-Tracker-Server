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

module.exports = {
    handleGetReceipts: getReceipts
}