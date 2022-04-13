import mongoose from 'mongoose'

const assignmentSubmitSchema = new mongoose.Schema({
    assignmentID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    }
},{
    timestamps: true
})

const AssignmentSubmit = mongoose.model('AssignmentSubmit', assignmentSubmitSchema)
export default AssignmentSubmit