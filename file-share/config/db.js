const mongoose=require('mongoose');
require('dotenv').config();


function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECT,{useNewUrlParser:true, useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
    const connect=mongoose.connection;

    connect.once('open',()=>{
        console.log('Database connected')
    }).catch(err=>{
        console.log('Connection with db failed')
    })
}


module.exports=connectDB;