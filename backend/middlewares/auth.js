const User=require('../models/userSchema');
const {catchAsyncErrors}=require('../middlewares/catchAsyncError');
const {ErrorHandler}=require('../middlewares/error');
const jwt=require('jsonwebtoken');

module.exports.isUserAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHandler('Please login!',401));
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded._id);
        // console.log(req.user);
        // console.log("Decoded token:", decoded);
        if(!req.user){
            return next(new ErrorHandler('User not found!',404));
        }

        // console.log("req.user11");
        next();
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler('Invalid token!',401))
    }
})