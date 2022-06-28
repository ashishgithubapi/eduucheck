const express = require('express');
const multer = require('multer');
const path = require('path')
const app = express();

app.use(express.json());
const userRouter = require('./Routers/userRouter');
const fileRouter = require('./Routers/fileRoute')
app.use(
    express.urlencoded({ extended: true })
    
);

const filestorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({
    storage:filestorageEngine,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|pdf|txt|jpeg|png|gif)$/)) {
            console.log('llllllll');
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
      }
})

app.post('/upload',upload.single('image'),(req,res)=>{
    res.status(200).json({
        status:'successful',
        message:'file upload successful'
    })

})


app.use('/api/user',userRouter)
app.use('/users',fileRouter)

module.exports = app