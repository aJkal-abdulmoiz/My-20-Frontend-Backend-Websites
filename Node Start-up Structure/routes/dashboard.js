const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard/index');
});

router.get('/new',(req,res) =>{
    res.render('file')
})

module.exports = router;
