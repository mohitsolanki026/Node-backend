const Otp = require("../models/otp");

async function generateOtp(req, res) {
    try {
        const {phoneNumber} = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);

        // Check for regeneration of OTP
        const stored = await Otp.findOne({ phoneNumber });

        if(stored.verified === true){
            return res.status(400).send("user already exists")
        }

        if (stored) {
            stored.otp = otp;
            await stored.save();
            return res.status(201).send("OTP generated successfully");
        }

        await Otp.create({
            phoneNumber,
            otp,
        });

        return res.status(201).send("OTP generated successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function verifyOtp(req,res){
    try{

        const {phoneNumber, otp} = req.body;

        const stored = await Otp.findOne({phoneNumber});

        if(!stored){
            return res.status(400).send("generate Otp first");
        }
        if(stored.otp === otp){
            stored.verified = true;
            await stored.save();
            return res.status(200).send("verify success");
        }
        else{
            return res.status(404).send("wrong Otp");
        }
        
    }catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

module.exports ={
    generateOtp,
    verifyOtp,
}