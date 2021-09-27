const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi');


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
  admin_password:{
      type: String,
      required: true
  },
  status:{
      type: String,
      default: 'active'
  }
},{timestamps: true})

adminSchema.methods.generatetokens = function () {
    const token = jwt.sign({_id:this._id}, 'private key')
    return token;
}

function admin_validation(admin){
    const schema = Joi.object({     
        admin_name: Joi.string().min(3).max(30).required(),
        admin_email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','so'] } }).required(),
        admin_type: Joi.string().min(1),
        admin_password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        status : Joi.string().min(1)   
     });
     return schema.validate(admin);
}

const Admin = mongoose.model('admins', adminSchema)

exports.Admin = Admin
exports.admin_validation = admin_validation