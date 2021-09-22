const mongoose = require('mongoose')
const Joi = require('joi')

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

const Admin = mongoose.model('admins', adminSchema)

module.exports = Admin