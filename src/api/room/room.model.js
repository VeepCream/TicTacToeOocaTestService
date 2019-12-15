import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
const { Schema } = mongoose

const roomSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    friend: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'updateOn'
    }
})

roomSchema.plugin(mongoosePaginate)
export default mongoose.model('room', roomSchema)