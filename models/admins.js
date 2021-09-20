const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs is used to hash passwords.

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

adminSchema.static.findByCredentilas = async (email, password) => {
     const admin = await Admin.findOne({email})
     if(!admin) {
         throw new Error('Unable to login')
     }
     //compare between the two passwords.
     const isMatch = await bcrypt.compare(password, admin.admin_password)

     if(!isMatch) {
        throw new Error('Unable to login')    
       }          
    return admin       
  }

const Admin = mongoose.model('admins', adminSchema)

module.exports = Admin