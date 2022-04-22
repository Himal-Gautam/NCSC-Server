import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    code: {
        type: Number,
        required: true,
        trim: true,
        default: "000",
        unique: true,
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Subject = mongoose.model('Subject', subjectSchema)
export default Subject