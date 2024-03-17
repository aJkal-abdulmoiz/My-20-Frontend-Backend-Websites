const express = require("express")
const router = express.Router()
const path = require("path");
const viewsPath = path.join(__dirname, '../views');

router.get('/',(req,res) =>{
    res.sendFile(path.join(viewsPath, 'index.html'));
})

router.get('/app',(req,res) =>{
    res.sendFile(path.join(viewsPath, 'app.html'));
})


module.exports = router;