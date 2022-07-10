const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path')
const app = express();


const userRouter = require('./Routers/userRouter');
const fileRouter = require('./Routers/fileRoute')
const offerRouter = require('./Routers/offerRoute')
const screenLockRouter = require('./Routers/screenLockRoute')
app.use(bodyParser.json());
app.use(
    express.urlencoded({ extended: true })
    
);


app.use(express.json());
app.use('/api',userRouter)
app.use('/users',fileRouter)
app.use('/api',offerRouter)
app.use('/api',screenLockRouter)

module.exports = app