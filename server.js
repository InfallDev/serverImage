const express = require('express');
const {uploadImage, deleteImage} = require("./file.controller");
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");
const app = express();
const port = 8888;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

app.post('/files', uploadImage);

app.delete('/files', deleteImage);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
