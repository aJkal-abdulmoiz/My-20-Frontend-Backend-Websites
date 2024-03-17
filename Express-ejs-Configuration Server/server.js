
const express = require("express")
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));




app.get('/',(req,res) => {
    res.render('main',{title: "Express with ejs"})
})

app.post('/sheetLink', async (req,res)=>{
    const {sheetLink} = req.body;

    console.log('Received Google Sheets Link:', sheetLink);

    res.status(200).json({success: true});

})

app.get('/getdata',(req,res)=>{
    const DATA = "This is the GET Route"
    res.send(DATA)
})




app.listen(PORT,()=>{
    try{
        console.log(`The Server is Running on port:${PORT}`)
    }
    catch(e){
        console.log(e)
    }
})