import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        default: "000"
    },
    teacherId:{
        type: Number,
        required: true,
        ref: 'User'
    }
})

const Subject = mongoose.model('Subject', subjectSchema)
export default Subject