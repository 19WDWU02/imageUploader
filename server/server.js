const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

const config = require('./config.json');

const Image = require('./models/images');

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_TABLE_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

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

const filterFile = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        req.validationError = 'invalid extension';
        cb(null, false, req.validationError);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filterFile
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

// http://192.168.33.10:3000/uploads/1568236627479-img_lights.jpg

app.use('/uploads', express.static('uploads'));

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Image uploader example');
});

app.post('/upload', upload.single('uploadedImage'), function( req, res){
    if(req.validationError === 'invalid extension'){
        res.send('invalid extension');
    } else {
        // console.log(req.body.imageName);
        // console.log(req.file.path);
        const image = new Image({
            _id: new mongoose.Types.ObjectId(),
            imgTitle: req.body.imageName,
            imgUrl: req.file.path
        });

        image.save().then(result => {
            res.send(result);
        }).catch(err => res.send(err));

    }
});

app.get('/allImages', function(req, res){
    Image.find().then(result => {
        res.send(result);
    })
})





app.delete('/:id', function(req, res){
    const id = req.params.id;
    Image.findById(id, function(err, imageDetails){
        if(err){
            res.send('cannot find image to delete from mongo');
        } else {
            if(fs.existsSync(imageDetails.imgUrl)){
                fs.unlink(imageDetails.imgUrl, (err) => {
                    if(err){
                        res.send('Cannot delete image from server');
                    } else {
                        Image.deleteOne({_id: id}, function(err){
                            if(err){
                                res.send('Cannot delete image from Mongo')
                            } else {
                                res.send('image was removed from Mongo');
                            }
                        })
                    }
                })
            } else {
                res.send('cannot find image to delete in the server');
            }
        }
    });
})





app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
