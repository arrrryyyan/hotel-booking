import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Clerk provides req.auth only when using requireAuth() middleware
    const userId = req.auth?.userId;
    
    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findOne({ _id: userId });


    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.json({ success: false, message: error.message });
  }
};
