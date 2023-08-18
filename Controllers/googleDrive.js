const {google} = require("googleapis");
const fs =  require("fs");
const path = require("path");
const mime = require("mime-types");
const { Stream } = require("stream");
const dotenv = require("dotenv");
dotenv.config("../.env");

const CLIENT_ID = process.env.CLIENTID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI ;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive  = google.drive({
    version: 'v3',
    auth : oauth2Client,
})

// const filepath = path.join(__dirname,'mohit.pdf');

async function upload(file) {
    try {
        const bufferS = new Stream.PassThrough();
        bufferS.end(file.buffer);

        const mimeType = file.mimetype;

        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: bufferS,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; 
    }
}

async function uploadFile(req, res) {
    try {
        // console.log(CLIENT_ID);
        const files = req.files;

        const uploadPromises = files.map(async (file) => {
            return await upload(file);
        });

        await Promise.all(uploadPromises);

        return res.status(200).send('Success');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Error uploading file.');
    }
}

module.exports = {
    uploadFile,
}