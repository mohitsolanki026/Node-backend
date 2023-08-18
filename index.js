const express = require("express");
const authRouter = require("./routers/authRouter");
const purchaseRouter = require("./routers/purchaseRouter")
const otpRouter = require("./routers/otpRoute");
const driveRouter = require("./routers/driveRouter");
const inventoryRouter = require("./routers/inventoryRouter");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dbconnect = require("./dbconnect")
const dotenv = require("dotenv");

dotenv.config("./.env");

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use("/otp", otpRouter);
app.use("/auth",authRouter);
app.use("/purchase",purchaseRouter)
app.use("/inventory",inventoryRouter);
app.use("/googleDrive",driveRouter);
app.use("/",(req,res)=>{
  return res.send("ok from server");
})

dbconnect();
app.listen(4000,()=>{
    console.log("Ok from server")
})