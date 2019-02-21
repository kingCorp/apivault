const express = require('express');
const morgan = require('morgan');    
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cloudinary = require('cloudinary');

const app = express();



//import routes
const filesRoutes = require('./api/routes/files');
const usersRoutes = require('./api/routes/user');

//db connect
require('./api/middleware/dbconnect');
// mongoose.connect("mongodb://vault:"+process.env.MONGO_ATLAS_PW+"@cluster0-shard-00-00-sqfmj.mongodb.net:27017,cluster0-shard-00-01-sqfmj.mongodb.net:27017,cluster0-shard-00-02-sqfmj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
// { useNewUrlParser: true })     

//mongoose.connect('mongodb://attasiemj@gmail.com:Jaymes92@ds155653.mlab.com:55653/vault', options);







//logs the server
app.use(morgan('dev'));
//making file accessible
app.use('/uploads',express.static('uploads'))
//parse url and json request
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//allow cross origin 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        Response.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({})
    }
    next();
});


//middleware routes handling requests
app.use('/files', filesRoutes);
app.use('/user', usersRoutes)



//handling errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})


module.exports = app;