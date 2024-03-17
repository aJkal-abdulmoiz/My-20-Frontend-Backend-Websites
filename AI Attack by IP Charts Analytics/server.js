const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const viewsPath = path.join(__dirname, './views');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());



app.get('/',(req,res) =>{
    res.sendFile(path.join(viewsPath, 'index.html'));
})


app.get('/dashboard',(req,res) =>{
    res.sendFile(path.join(viewsPath, 'dashboard.html'));
})

let attacks = [];


if (fs.existsSync('attacks.json')) {
    const data = fs.readFileSync('attacks.json', 'utf8');
    attacks = JSON.parse(data);
}


function saveAttacks() {
    fs.writeFileSync('attacks.json', JSON.stringify(attacks), 'utf8');
}



app.post('/dashboard/input', (req, res) => {
    const { ip, attack,packetSize } = req.body;
    attacks.push({ ip, attack, packetSize });
    saveAttacks();
    res.sendStatus(200);
});



app.get('/dashboard/visualize', (req, res) => {
    res.json(attacks);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
