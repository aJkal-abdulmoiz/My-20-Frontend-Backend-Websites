const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const staticRoute = require('./routes/staticRoute')
const BmiRoute = require('./routes/bmi')
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(express.json());
app.setMaxListeners(15);

app.use('/',staticRoute);
app.use('/bmi',BmiRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
