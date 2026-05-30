import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = header.slice(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

export function requireVerified(req, res, next) {
  if (req.userRole === "hospital") {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }
    if (!req.user.isApproved) {
      return res.status(403).json({ error: "Hospital account pending approval" });
    }
  } else if (req.userRole === "citizen" || req.userRole === "ambulance") {
    if (!req.user.isPhoneVerified) {
      return res.status(403).json({ error: "Phone not verified" });
    }
  }
  if (!req.user.isVerified) {
    return res.status(403).json({ error: "Account not verified" });
  }
  next();
}
