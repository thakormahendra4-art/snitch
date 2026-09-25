import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products:{
        product:{
            type:String,
            ref:"products",
            required:true
        },
        quality:{
            type:Number,
            default:1,
            min:1
        },
        size:{
            type:String,
             enum: [ "XS", "S", "M", "L", "XL", "XXL" ]
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})


const cartModel = mongoose.model("carts", cartSchema)

export default cartModel