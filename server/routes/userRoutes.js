import express from "express";
import { userRegistration, userLogin, handleChangedPassword, loggedUser, sendResetPasswordEmail, updateAndResetPassword } from "../controllers/userController.js";
import checkUserAuthantication from "../middlewares/auth-middleware.js";

const router = express.Router();

// Route level middleware - To protect route
router.use('/changepassword', checkUserAuthantication)
router.use('loggeduser',checkUserAuthantication)

// Public Routes
router.post('/register', userRegistration);
router.post('/login', userLogin);
router.post('/reset-password', sendResetPasswordEmail)
router.post('/update-reset-password/:id/:token' , updateAndResetPassword)
// Protected Route
router.post('/changepassword', handleChangedPassword);
router.get('/loggeduser', loggedUser)

export default router;

