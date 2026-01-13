const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
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
    ]
},
{
    timestamps: true
});

const User=mongoose.model("User", userSchema);
module.exports=User;
