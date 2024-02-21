const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    console.log(req.headers, "req hed");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(404).json("Access Not granted");
    }
    jwt.verify(token, "MY_SERVER_SECRET", (err, user) => {
      if (err) {
        return res.status(500).json(`${err}Invalid token`);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json(`${error}Invalid token`);
  }
};
module.exports = authMiddleware;
