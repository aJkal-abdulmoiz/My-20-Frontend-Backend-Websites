const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home/index');
});

router.post('/req', (req, res) => {
    const { username, rollNo, id } = req.body;
    const message = `You with: ${username}, ${rollNo}, ${id} are banned`;
    console.log('Received data:', { username, rollNo, id });
    res.send(message);
});


module.exports = router;
