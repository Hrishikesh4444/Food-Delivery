import express from 'express'
import { loginUser,paymentRazorpay,registerUser, verifyRazorpay } from '../controllers/userController.js'

const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post('/payment-razorpay',paymentRazorpay)
userRouter.post('/verify-razorpay',verifyRazorpay)

export default userRouter;