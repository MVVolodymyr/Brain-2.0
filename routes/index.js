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

// Add routes for game static assets
router.get('/game/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(filename, { root: 'game' });
});

// Add routes for game subdirectory assets
router.get('/game/:subdir/:filename', (req, res) => {
    const subdir = req.params.subdir;
    const filename = req.params.filename;
    res.sendFile(`${subdir}/${filename}`, { root: 'game' });
});

module.exports = router;
