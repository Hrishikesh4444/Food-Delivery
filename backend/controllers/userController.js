import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import razorpay from "razorpay";
import orderModel from "../models/orderModel.js";

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success: false,message:"User doesn't exist"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success: false,message:"Invalid credentials"});
        }
        const token=createToken(user._id);
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success: false,message: "Error"});
    }
}


const registerUser=async(req,res)=>{
    const {name,password,email}=req.body;
    try {
        //if user already exist
        const exists=await userModel.findOne({email});
        if(exists){
            return res.json({success: false,message: "User already exists"})
        }

        //validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success: true,message:"Please provide a valid email"});
        }
        if(password.length < 8){
            return res.json({success: false,message: "Please enter a strong password"});
        }

        //hashing password
        const salt=await bcrypt.genSalt(10);// 10-->enter a number between 5 to 15, higher the number more stronger
        const hashPassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashPassword,
        })
        const user=await newUser.save();

        const token=createToken(user._id);
        res.json({success: true,token});
    } catch (error) {
         console.log(error);
         res.json({success: false,message: "Error"});
    }
}



// const razorpayInstance = new razorpay({
  
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
//api to make payment of order using razorpay
//api to make payment of order using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { items, amount, address, userId } = req.body; // from frontend

    const options = {
      amount: amount * 100, // in paise
      currency: process.env.CURRENCY,
      receipt: "temp_receipt_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    // Send back the order and user/order data to frontend
    res.json({ success: true, order, items, amount, address, userId });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, amount, address, userId } = req.body;

    const razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order_info = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (order_info.status === "paid") {
      // Save to DB now
      const newOrder = new orderModel({
        userId,
        items,
        amount,
        address,
        payment: true,
      });

      await newOrder.save();

      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




export { loginUser, registerUser, paymentRazorpay, verifyRazorpay };