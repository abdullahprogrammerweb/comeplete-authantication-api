import express from "express";
import {userRegistration , userLogin} from "../controllers/userController.js";


// instance of routes in the variable
const router = express.Router();

// Public Routes
router.post('/register', userRegistration)
router.post('/login', userLogin)
//  Protected Routes

export default router;