const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const path = require('path');
const fileUploader = require('../config/cloudinary.config');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', fileUploader.single('avatar'), (req, res) => {
    const { username, password } = req.body;

    bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            User.create({
                username,
                password: hash,
                avatarUrl: req.file.path
            })
        })
        .then(() => res.redirect('/auth/profile'))
        .catch(err => console.log(err));


});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(foundUser => {
            console.log(foundUser.username)
            bcrypt.compare(password, foundUser.password)
                .then(result => result ? res.redirect(`/auth/profile/${foundUser.username}`) : res.render('auth/login', { errorMessage: `Wrong password. Try again.` }))
                .catch(err => console.log(err));
        })
        .catch(() => res.render('auth/login', { errorMessage: `Wrong username. Try again.` }));
});

router.get('/profile/:username', (req, res) => {
    const { username } = req.params;

    User.findOne({ username })
        .then(user => res.render('auth/profile', { user }))
        .catch(err => console.log(err));
    
});


module.exports = router;