import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: Number,
        required: true,
        trim: true,
        default: "000"
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Subject = mongoose.model('Subject', subjectSchema)
export default Subject