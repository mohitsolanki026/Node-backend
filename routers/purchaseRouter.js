const express = require('express');
const router = express.Router();
const purchaseController = require('../Controllers/purchaseController');

router.post('/create', purchaseController.createPurchase);
router.get('/history/:startDate/:endDate/:_id', purchaseController.purchaseHistory);
router.put('/edit/:purchaseId', purchaseController.editPurchase);
router.delete('/delete/:_id/:ID', purchaseController.deletePurchase);

module.exports = router;
