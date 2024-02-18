import express from "express";
import { userRegistration, userLogin, handleChangedPassword, loggedUser } from "../controllers/userController.js";
import checkUserAuthantication from "../middlewares/auth-middleware.js";

const router = express.Router();

// Route level middleware - To protect route
router.use('/changepassword', checkUserAuthantication)
router.use('loggeduser',checkUserAuthantication)

// Public Routes
router.post('/register', userRegistration);
router.post('/login', userLogin);

// Protected Route
router.post('/changepassword', handleChangedPassword);
router.get('/loggeduser', loggedUser)

export default router;
