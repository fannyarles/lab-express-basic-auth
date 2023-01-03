const { isLoggedIn, isLoggedOut } = require('../middleware/routes.guard');

const router = require('express').Router();

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('lab/main', { loggedIn: true });
});

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('lab/private', { loggedIn: true });
});

module.exports = router;