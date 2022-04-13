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

// userSchema.virtual("submissions", {
//     ref: "AssignmentSubmit",
//     localField: "_id",
//     foreignField: "assignment_ID",
//   });

const Assignment = mongoose.model('Assignment', assignmentSchema)
export default Assignment