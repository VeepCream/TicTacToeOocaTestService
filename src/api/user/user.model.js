import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
const { Schema } = mongoose

const userSchema = new Schema({
    platform: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'updateOn'
    }
})

userSchema.plugin(mongoosePaginate)
export default mongoose.model('user', userSchema)