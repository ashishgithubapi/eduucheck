require('dotenv/config');
const mongoose = require('mongoose')
const cors = require('cors');
const express = require('express');

const app = require('./app');

const DB = 'mongodb+srv://educheck:3S0b1mGSZJEY4e8D@cluster0.mwwvw.mongodb.net/Eduucheck?retryWrites=true&w=majority'

// mongoose.connect(process.env.MONGODB_URL_LOCAL,{
//     useNewUrlParser: true,
//     useUnifiedTopology:true,
//     // useCreateIndex:true
// })

// .then(()=>console.log("connected"))
// .catch((err)=>console.log(err))

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
   
}).then(()=>{
    console.log('connection successfullllll');
}).catch((err)=>{
    console.log(err);
});

const port = process.env.PORT || 3001
app.use('/images', express.static('images'));
app.use(cors());
app.listen(port,()=>{
    console.log(`app running on port ${port}`);
})
