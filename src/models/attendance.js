import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
    student:{
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

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance