const router = require("express").Router();
const inventoryController = require("../Controllers/inventoryController");

router.get("/all/:_id",inventoryController.inventory);


module.exports = router;