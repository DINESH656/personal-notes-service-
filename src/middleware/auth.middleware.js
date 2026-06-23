import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Debug logs (temporary) — don't print full token in production
    console.debug("auth.middleware: Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (token) console.debug("auth.middleware: token fragment:", token.slice(0, 10) + "...");

    if (!process.env.JWT_SECRET) {
      console.error("auth.middleware: JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.debug("auth.middleware: decoded token payload:", decoded);
    } catch (verifyError) {
      console.error("auth.middleware: token verification error:", verifyError.message);
      throw verifyError;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("auth.middleware: authentication failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};