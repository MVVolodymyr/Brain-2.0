var express = require('express');
var router = express.Router();

router.get('/', (req, res) =>{
    res.render("index", {title:"Express"});
});

// Add route for events page
router.get('/events', (req, res) => {
    res.sendFile('events.html', { root: 'public' });
});

module.exports = router;
