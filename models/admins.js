const mongoose = require('mongoose')
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const adminSchema = new mongoose.Schema({
  admin_name:{
      type: String
  },
  admin_email:{
      type:String,
      lowercase: true,
  },
  admin_type:{
      type:String,
      default: 'rector'
  },
  token:{
    type: String
    },
  admin_password:{
      type: String,
      required: true
  },
  status:{
      type: String,
      default: 'active'
  }
},{timestamps: true})

adminSchema.methods.generateToken = async function(){
    const admin = this
    const token = jwt.sign({ _id: admin._id.toString() }, 'privateKey');
    return token
}

// @JOI package validation function.
//added joi schema to validate before added into the db.

function admin_validation(admin){
    const schema = Joi.object({     
        admin_name: Joi.string().min(3).max(30).required(),
        admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
        admin_type: Joi.string(),
        token: Joi.string(),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
     });
     return schema.validate(admin);
}

const Admin = mongoose.model('admins', adminSchema)

exports.Admin = Admin
exports.admin_validation = admin_validation