const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest' // Added new role
};

const checkPermission = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError('Unauthorized', 401);
      }

      const hasPermission = await checkUserRole(user.id, requiredRole);
      if (!hasPermission) {
        throw new AppError('Forbidden', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
