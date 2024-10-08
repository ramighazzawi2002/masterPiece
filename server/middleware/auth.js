// decode the token and get user details middlewere
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.userId;
    console.log("req.user", req.user);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
};

module.exports = auth;
