const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");

const signToken = (id)=> {
    return jwt.sign({id:id},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN})
}

exports.signup = async (req, res) =>{
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        res.status(201).json({
            status: "success",
            data: newUser,
            token
        })
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        //1. Check if email and password exists
        if(!email || !password){
            throw new Error("Please provide email and password")
        }
        //2. Check if user and password are correct
        const user = await User.findOne({email}).select("+password");
        if(!user || !(await user.correctPassword(password, user.password))){
            throw new Error("Incorrect password and email");
        }
        const token = signToken(user.id);
        //3. If everything is ok, send token to client
        res.status(201).json({
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        })
    }catch(err){
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
}

exports.protect = async (req, res, next)=>{

    try{
        //1. get token
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            throw new Error("User is not authnetificated");
        }
        //2. Token verifictaion
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        // console.log(decoded)
        //3. check if User exists
        const currentUser = await User.findById(decoded.id);
        // console.log(currentUser)
        if(!currentUser){
            throw new Error("user does not exist");
        }
        //4. Check if user changed password after token was issued
        if(currentUser.changePasswordAfter(decoded.iat)){
            throw new Error("user changed password, token is invalid")
        }

    //Grant access

    req.user = currentUser;
    next();

    }catch(err){
        res.status(400).json({
            status: "fail",
            error: err.message
        })
    }
    
}

exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: "failed",
                message: "You don't have permissions for this action"
            })
        }else{
            next()
        }
    }
}