const Inventory = require("../models/inventory");

async function inventory(req,res){
    try {        
        const {_id} = req.params;
        const stock = await Inventory.findOne({owner:_id});
        return res.status(200).send(stock);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    inventory,
}