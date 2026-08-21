const express = require("express");
const {
    adminLogin,
    adminLogout,
    getAdminProfile
} = require("../controllers/adminAuthController");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

router.get("/profile", ...requireAdmin, getAdminProfile);

module.exports = router;
