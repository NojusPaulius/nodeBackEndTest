const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userShema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please tell your name"]
    },
    email:{
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Is not email"]
    },
    photo: {
        type: String
    },
    role:{
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user"
    },
    password:{
        type: String,
        required: [true, "please provide passowrd"],
        minLength:8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm password"],
        validate: {
            validator: function (el){
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userShema.pre("save", async function(next){
    // hash password with 12 cost
    this.password = await bcrypt.hash(this.password,12);

    this.passwordConfirm = undefined;

    next()
});

userShema.methods.correctPassword = async (canditatePassword, userPassword)=>{
    return await bcrypt.compare(canditatePassword, userPassword)
};

userShema.methods.changePasswordAfter = function (JwtTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JwtTimestamp < changedTimestamp;
    }
}

const User = mongoose.model("User", userShema);

module.exports = User;

