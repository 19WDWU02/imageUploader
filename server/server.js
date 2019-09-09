const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

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
    res.send('Upload Image here');
});

app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
