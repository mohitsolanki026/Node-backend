const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Inventory = require("../models/inventory");

async function signupController(req,res){
    try {
        const {email, password, shopName, pinCode,} = req.body;
        console.log(email);
        if(!email || !password  || !shopName){
            return res.status(409).send("all fields are required");
        }

        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.status(403).send("user already exists please Login");
        };

        const newuser = await User.create({
            email,
            password,
            shopName,
            pinCode,
        });

        const inventory = await Inventory.create({
            owner: newuser._id,
        });

        newuser.inventory = inventory._id;

        await newuser.save();
    

        const accessToken = generateAccessToken({
            _id: newuser._id,
        });

        const refreshToken = generateRefreshToken({
            _id: newuser._id,
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true, 
            secure: true,
        });

        return res.status(201).send({accessToken});

    } catch (e) {
        console.log(e)
        return res.status(500).send(e.message);
    }
}

async function loginController(req,res){
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required");
            return res.status(400).send( "All fields are required");
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            // return res.status(404).send("User is not registered");
            return res.status(404).send("User is not registered");
        }

        if (password != user.password) {
            // return res.status(403).send("Incorrect password");
            return res.status(403).send("incorrect password");
        }

        const accessToken = generateAccessToken({
            _id: user._id,
        });

        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).send({accessToken});
    } catch (e) {
        return res.status(500).send(e.message);
    }
};


const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        // return res.status(401).send("Refresh token in cookie is required");
        return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies.jwt;

    // console.log('refresh token from cookie ', refreshToken);

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.status(201).send({ accessToken });
    }catch(e) {
        console.log(e);
        // return res.status(401).send("Invalid refresh token");
        return res.status(401).send("Invalid refresh token");
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })
        return res.status(200).send('user logged out');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

//internal functions
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data,"vvgvyyt5687h", {
            expiresIn: "1d",
        });
        // console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data,"huniu97yhui0", {
            expiresIn: "1y",
        });
        return token;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signupController,
    loginController,
    logoutController,
    refreshAccessTokenController,
}