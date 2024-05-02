import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

export const checkRole = (roles) => (req, res, next) => {
  console.log(req.user.user.role);
  if (!roles.includes(req.user.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
