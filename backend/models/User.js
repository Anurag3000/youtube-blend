const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    
    name:{
        type: String,
        required: true,
        trim: true
    },
    channels: [{
        name: {type: String, required: true},
        count: {type: Number, required: true}
    }
    ],
    categories: [{
        name: {type: String, required: true},
        count: {type: Number, required: true}
    }
    ],
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },
    email:{
        type:String
    },
    avatar:{
        type: String
    }
},
{
    timestamps: true
});

const User=mongoose.model("User", userSchema);
module.exports=User;
