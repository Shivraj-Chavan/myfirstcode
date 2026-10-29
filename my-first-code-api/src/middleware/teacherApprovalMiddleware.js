export const checkTeacherApproved = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return next();
  }

  // assume req.user.isApproved comes from DB or token
  if (!req.user.isApproved) {
    return res.status(403).json({
      message: "Teacher not approved by admin yet",
    });
  }

  next();
};