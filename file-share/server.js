const express=require('express');
const app=express();
const path=require('path')
const PORT=process.env.PORT||3000;
const connectDB=require('./config/db');
connectDB();
app.use(express.json());
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')
const sgMail = require('@sendgrid/mail')
app.use(express.static('public'));
//Routes
app.use('/api/files',require('./routes/files'))

app.use('/files',require('./routes/show'))

app.use('/files/download',require('./routes/download'))

app.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`)
})

