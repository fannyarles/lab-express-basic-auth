const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const path = require('path');
const fileUploader = require('../config/cloudinary.config');
const { nextTick } = require('process');
const { isLoggedIn, isLoggedOut } = require('../middleware/routes.guard');

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup', { loggedIn: false });
});

router.post('/signup', isLoggedOut, fileUploader.single('avatar'), (req, res) => {
    const { username, password, avatar } = req.body;

    let filePath;
    avatar ? filePath = req.file.path : filePath = null;

    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            User.create({
                username,
                password: hash,
                avatarUrl: filePath
            })
            .then(user => res.redirect(`/auth/login`))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err));


});

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login', { loggedIn: false });
});

router.post('/login', isLoggedOut, (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(foundUser => {
            console.log(foundUser.username)
            bcrypt.compare(password, foundUser.password)
                .then(result => {
                    if (result) {
                        const { username } = foundUser;
                        req.session.loggedinUser = { username };
                        res.redirect(`/auth/profile`)
                    } else { 
                        res.render('auth/login', { errorMessage: `Wrong password. Try again.`, loggedIn: false })
                    }
                })
                .catch(err => console.log(err));
        })
        .catch(() => res.render('auth/login', { errorMessage: `Wrong username. Try again.`, loggedIn: false }));
});

router.get('/profile', isLoggedIn, (req, res) => {

    const { username } = req.session.loggedinUser;

    User.findOne({ username })
        .then(user => res.render('auth/profile', { user, loggedIn: true }))
        .catch(err => console.log(err));
    
});

router.post('/logout', isLoggedIn, (req, res, next) => {

    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    })
    
});


module.exports = router;