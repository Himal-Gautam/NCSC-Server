import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subjects'
    }
},{
    timestamps: true
})

const Assignment = mongoose.model('Assignment', assignmentSchema)
export default Assignment