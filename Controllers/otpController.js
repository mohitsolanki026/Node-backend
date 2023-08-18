const Otp = require("../models/otp");
const nodemailer = require('nodemailer');

async function generateOtp(req, res) {
    try{
        const { phoneNumber, email } = req.body;

        const otp = Math.floor(1000 + Math.random() * 9000);

        // Check for regeneration of OTP

        const stored = await Otp.findOne({ phoneNumber });

        if (stored && stored.verified === true) {
            return res.status(400).send('User already exists');
        }

        if (stored) {
            stored.otp = otp;
            await stored.save();
        } else {
            await Otp.create({
                phoneNumber,
                otp,
            });
        }

        // Sending OTP to the user's email using Nodemailer

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'letsgrowtogether026@gmail.com',
                pass: 'anyygghfinbepwwm',
            },
        });

        const mailOptions = {
            from: 'letsgrowtogether026@gmail.com',
            to: email, 
            subject: 'OTP Verification',
            text: `Your OTP: ${otp}`,
        };
        
        const re =await transporter.sendMail(mailOptions);
        console.log(re);
        return res.status(201).send('OTP generated and sent successfully');
    }catch (error) { 
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