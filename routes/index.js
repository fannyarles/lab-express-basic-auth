const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  let loggedIn;
  req.session.loggedinUser ? loggedIn = true : loggedIn = false;
  res.render("index", { loggedIn });
});

module.exports = router;
