const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;
  try {
    let decoded = jwt.verify(token, process.env.SECRETKEY);
    /**Recall that the payload used, was the user id **/
    User.findOne({ _id: decoded, token: token })
    .select('-password')
    .select('-token')
    .then((user) => {
      if (!user) {
        return res.json({
          isAuth: false,
          error: true,
        });
      }
      req.token = token;
      req.user = user;
      next();
    });
  } catch (error) {
    res.json({
      isAuth: false,
      error: true,
      verification: false
    })
  }
};

module.exports = { auth };
