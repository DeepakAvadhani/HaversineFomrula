const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
exports.verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["o-auth-token"];
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Unauthorized" });
  }
  const token = tokenHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
