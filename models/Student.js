const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'الاسم مطلوب'], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'البريد الإلكتروني مطلوب'], 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'كلمة المرور مطلوبة'] 
    },
    isActivated: { 
        type: Boolean, 
        default: false 
    },
    enrolledCourses: [{
        courseName: String,
        date: { type: Date, default: Date.now }
    }],
    lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);