const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

const config = require('./config.json');

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_TABLE_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected to mongo db');
});

// const upload = multer({dest: './uploads'});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Image uploader example');
});

app.post('/upload', upload.single('uploadedImage'), function( req, res){
    console.log(req.body);
    res.send('Upload Image here');
});

app.get('/allImages', function(req, res){
    res.send('Get All Images');
})

app.delete('/:id', function(req, res){
    const id = req.params.id;
    res.send(id);
})

app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
