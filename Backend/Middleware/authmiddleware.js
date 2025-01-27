const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const authmiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).send({ message: "You are not authenticated", error: true });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).send({ message: "User not found", error: true });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).send({ message: "Token is not valid", error: true });
  }
};

module.exports = { authmiddleware };