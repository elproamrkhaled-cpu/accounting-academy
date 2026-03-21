const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// إعدادات السيرفر الأساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- [ الربط العالمي بـ MongoDB Atlas ] ---
// الرابط اللي أنت بعته مع إضافة اسم قاعدة البيانات AccountingDB
const dbURI = "mongodb+srv://elproamrkhaled_db_user:12345dina@cluster0.nuunm4z.mongodb.net/AccountingDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("🚀 السيطرة كاملة! السيرفر اتربط بالسحابة العالمية بنجاح"))
    .catch(err => console.error("❌ فشل الاتصال بالسحابة - راجع الرابط أو الإنترنت:", err));

// --- [ تعريف نموذج الطالب - Schema ] ---
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// --- [ المسارات البرمجية - Routes ] ---

// 1. تسجيل طالب جديد
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: "هذا الإيميل مسجل بالفعل" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newStudent = new Student({ name, email, password: hashedPassword });
        await newStudent.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "خطأ في حفظ البيانات" });
    }
});

// 2. تسجيل دخول طالب
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student) return res.status(401).json({ success: false, message: "البيانات غير صحيحة" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "كلمة المرور خطأ" });

        student.lastLogin = Date.now();
        await student.save();
        res.json({ success: true, name: student.name });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// 3. مسار لوحة الإدارة (لجلب كل الطلاب)
app.get('/api/admin/all-students', async (req, res) => {
    try {
        const students = await Student.find().select('-password').sort('-createdAt');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
});

// تشغيل السيرفر على المنفذ العالمي أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ==========================================
    💎 منصة الأكاديمية أصبحت "عالمية" الآن 💎
    📍 السيرفر يعمل على المنفذ: ${PORT}
    📡 الرابط المحلي: http://localhost:${PORT}
    ==========================================
    `);
});