const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is not Invalid')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    roleAdmin: {
        type: String,
        default: "user"
    },
},{
    timestamps: true
});

userSchema.static.findByCredentials = async (email, password) => {
     const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
    //compare between the two passwords.
    const isMatch = await bcryptjs.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')    
    }
    return user 
}

const User = mongoose.model('User', userSchema);

module.exports = User;