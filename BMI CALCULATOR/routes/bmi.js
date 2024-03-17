const express = require('express')
const app = express();
app.use(express.json());
const router = express.Router()

const {calculateBMI} = require('../controllers/BMI')

router.post('/',calculateBMI)

module.exports = router;