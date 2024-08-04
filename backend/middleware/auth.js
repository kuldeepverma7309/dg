const auth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "User not authenticated",
            success: false,
        });
    }
    req.id = req.session.userId;
    next();
};

export default auth;
