const router = require("express").Router();
const drive = require("../Controllers/googleDrive");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.post("/upload", ,

router.post("/upload", upload.array("file"), drive.uploadFile );

module.exports = router;