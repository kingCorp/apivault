const mongoose = require('mongoose')

mongoose.Promise = global.Promise
var mongodbUri ='mongodb://@ds155653.mlab.com:55653/vault';
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  auth: {
    user: 'attasiemj@gmail.com',
    password: 'Jaymes92'
  }
})
var conn = mongoose.connection;    
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', () =>{
 console.log('connected to a database')                       
});