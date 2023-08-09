const Purchase = require("../models/purchase");
const Inventory = require("../models/inventory");
const User = require("../models/user");


async function createPurchase(req, res) {
    try {
        const { _id, medicines, billNo, refrenceNo, date, gstin, subTotal, discount, tax, grandTotal, } = req.body;

        const newpurchase = await Purchase.create({
            owner: _id,
            medicines,
            billNo,
            refrenceNo,
            date,
            gstin,
            subTotal,
            discount,
            tax,
            grandTotal,
        });

        const user = await User.findOne({ _id });

        user.purchases.push(newpurchase._id);
        await user.save();

        const inventory = await Inventory.findOne({ owner: user._id });

        for (const item of medicines) {

            //check for medicines exist in inventory 
            const existingMedicine = await inventory.medicines.find(med => med.medicineName === item.medicineName && med.rate === item.rate && med.MRP === item.MRP && med.packageType === item.packageType && med.pack === item.pack);
            console.log(existingMedicine);
            if (existingMedicine) {
                existingMedicine.quantity += item.quantity;
            } else {
                inventory.medicines.push(item);
            }

            // check of medicine to remove from collection of outofstock medicines
            const outOfStockMedicineIndex = await inventory.outOfStock.findIndex(med => med.medicineName === item.medicineName && med.packageType === item.packageType && med.pack === item.pack); 
            if (outOfStockMedicineIndex !== -1) {
                inventory.outOfStock.splice(outOfStockMedicineIndex, 1);
            }
        }

        await inventory.save();

        return res.status(200).send("success");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function purchaseHistory(req, res) {
    try {
        const { startDate, endDate, _id } = req.params;

        const purchases = await Purchase.find({
            owner: _id,
            date: {
                $gte: new Date(startDate),  // Greater than or equal to startDate
                $lte: new Date(endDate),    // Less than or equal to endDate
            }
        });

        return res.status(200).json(purchases);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function editPurchase(req,res){
    try {
        const {purchaseId} = req.params; 
        const { medicines, billNo, refrenceNo, date, gstin, subTotal, discount, tax, grandTotal} = req.body;
        const oldpurchase = await Purchase.findById(purchaseId)

        if(medicines){
            oldpurchase.medicines = medicines
        }
        if(billNo){
            oldpurchase.billNo = billNo;
        }
        if(refrenceNo){
            oldpurchase.refrenceNo = refrenceNo;
        }
        if(date){
            oldpurchase.date = date;
        }
        if(gstin){
            oldpurchase.gstin = gstin;
        }
        if(subTotal){
            oldpurchase.subTotal = subTotal;
        }
        if(discount){
            oldpurchase.discount = discount;
        }
        if(tax){
            oldpurchase.tax = tax;
        }
        if(grandTotal){
            oldpurchase.grandTotal = grandTotal;
        }

        await oldpurchase.save();

        return res.status(200).send("success");

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deletePurchase(req, res) {
    try {
        const { _id, ID } = req.params;

        const oldPurchase = await Purchase.findById(_id);
        const inventory = await Inventory.findOne({ owner: ID });

        for (const item of oldPurchase.medicines) {
            const sameMed = inventory.medicines.find(med => med.medicineName === item.medicineName && med.packageType === item.packageType && med.MRP === item.MRP && med.pack === item.pack && med.rate === item.rate);

            if (sameMed) {
                sameMed.quantity -= item.quantity;
                if (sameMed.quantity <= 0) {
                    inventory.medicines.pull(sameMed);
                } else {
                    await sameMed.save();
                }
            }
        }

        await Purchase.deleteOne({ _id });

        await inventory.save(); 

        return res.status(200).send("Deleted");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


module.exports = {
    createPurchase,
    purchaseHistory,
    editPurchase,
    deletePurchase,
}