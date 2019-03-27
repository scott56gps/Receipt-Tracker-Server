const receiptModel = require('../models/receipt-model');

function getReceipts(request, response) {
    receiptModel.getReceiptsModel(function (err, receipts) {
        if (err) {
            console.error(err);
            return;
        }

        response.json(receipts);
    })
}

function getReceipt(request, response) {
    var requestId = request.params.id;
    receiptModel.getReceiptModel(requestId, function (err, receipt) {
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

    receiptModel.createReceipt(receiptDto, (err, receipt) => {
        if (err) {
            console.error(err);
            response.status(500).json({ success: false, error: err })
            return;
        }

        response.json(receipt);
    })
}

function updateReceipt(request, response) {
    // Parse the variables from the PUT request body
    var id = request.body.id;
    var vendorName = request.body.vendorName;
    var date = request.body.date;
    var total = request.body.total;
    var items = request.body.items;

    var receiptDto = {
        id: id,
        vendorName: vendorName,
        date: date,
        total: total,
        items: items
    }

    receiptModel.updateReceipt(receiptDto, (err, receipt) => {
        if (err) {
            console.log(err)
            response.status(500).json({ success: false, error: err });
        }

        response.json(receipt)
    })
}

function deleteReceipt(request, response) {
    // Parse the receipt id from the request
    var receiptId = request.params.id

    receiptModel.deleteReceipt(receiptId, (error) => {
        if (error) {
            console.log(error)
            response.status(500).json({ success: false, error: error })
            return;
        }

        response.json({ success: true })
    })
}

module.exports = {
    handleGetReceipts: getReceipts,
    handleGetReceipt: getReceipt,
    handlePostReceipt: postReceipt,
    handleUpdateReceipt: updateReceipt,
    handleDeleteReceipt: deleteReceipt
}