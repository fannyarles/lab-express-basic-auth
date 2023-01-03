
const isLoggedIn = (req, res, next) => {
    if ( !req.session.loggedinUser ) {
        res.redirect('/auth/login');
        return;
    }
    
    next();
}

const isLoggedOut = (req, res, next) => {
    if ( req.session.loggedinUser ) {
        res.redirect('/auth/profile');
        return;
    }

    next();
}

module.exports = { isLoggedIn, isLoggedOut };