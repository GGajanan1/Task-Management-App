const User=require('../models/userSchema');
const {catchAsyncErrors}=require('../middlewares/catchAsyncError');
const {ErrorHandler}=require('../middlewares/error');

module.exports.userSignup=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const userExist=await User.findOne({email});
    if(userExist){
        return next(new ErrorHandler("User already exist try logging in!",400));
    }
    const user=await User.create({name,email,password});
    const token=user.generateAuthToken();
    res
        .status(201)
        .cookie("token",token,{
            httpOnly:true,
            expires:new Date(Date.now()+5*24*60*60*1000),
        })
        .json({
            success:true,
            user,
            message:"User added successfully",
            token,
        })
})

module.exports.userLogin=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body; 
    if(!email || !password){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const user=await User.findOne({email}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401));
    }
    const token=user.generateAuthToken();
    res
        .status(200)
        .cookie("token",token,{
            httpOnly:true,
            expires:new Date(Date.now()+ 5*24*60*60*1000),
        })
        .json({
            success:true,
            user,
            message:"User Login successfully",
            token
        })
})

module.exports.userLogout=catchAsyncErrors(async(req,res,next)=>{
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res
        .status(200)
        .json({
            success:true,
            message:"User Logout successfully",
        })
})