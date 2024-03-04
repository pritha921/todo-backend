const mongoose= require('mongoose');
const userSchema= mongoose.Schema(
    {
        userName:{
            type:String,
            required:true,
        },
        password:{
            type: String,
            required:true
        }
    },

    {
        timestamps:true,
    }

)

const auth= mongoose.model('auth',userSchema)

module.exports= auth

