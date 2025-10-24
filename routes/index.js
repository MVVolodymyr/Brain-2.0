var express = require('express');
var router = express.Router();

router.get('/', (req, res) =>{
    res.render("index", {title:"Express"});
});

// Add route for events page
router.get('/events', (req, res) => {
    res.sendFile('events.html', { root: 'public' });
});

// Add route for game page
router.get('/game', (req, res) => {
    res.sendFile('index.html', { root: 'game' });
});

module.exports = router;
