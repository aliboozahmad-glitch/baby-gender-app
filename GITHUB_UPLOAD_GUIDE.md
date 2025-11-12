# 📤 دليل رفع المشروع على GitHub (بدون خاصية Save)

## الخطوة 1: تحميل ملف المشروع

لقد تم إنشاء ملف مضغوط يحتوي على جميع ملفات المشروع.

### كيفية الحصول على الملف:

**الملف موجود في:**
```
/tmp/baby-gender-complete.tar.gz
```

**طرق الحصول عليه:**

#### الطريقة 1: عبر الوكيل (Agent)
اطلب من الوكيل تحميل الملف لك:
```
"هل يمكنك مساعدتي في تحميل ملف /tmp/baby-gender-complete.tar.gz"
```

#### الطريقة 2: عبر فريق الدعم
1. انضم لخادم Discord: https://discord.gg/VzKfwCXC4A
2. أو راسل: support@emergent.sh
3. اطلب:
   - "أحتاج ملف المشروع المضغوط"
   - ضمّن Job ID (من أيقونة ℹ️ في الواجهة)

#### الطريقة 3: نسخ الملفات يدوياً
انتقل للطريقة اليدوية أدناه ⬇️

---

## الخطوة 2: إنشاء Repository على GitHub

### 1. إنشاء حساب GitHub (إذا لم يكن لديك)
- اذهب إلى: https://github.com/signup
- سجّل حساب مجاني

### 2. إنشاء Repository جديد
1. اذهب إلى: https://github.com/new
2. املأ المعلومات:
   ```
   Repository name: baby-gender-app
   Description: تطبيق توقع نوع الجنين والأمراض الوراثية
   Visibility: Private (خاص) - موصى به
   ```
3. ✅ اختر "Add a README file"
4. ✅ اختر "Add .gitignore" → Python
5. اضغط **"Create repository"**

---

## الخطوة 3: رفع الملفات على GitHub

### الطريقة 1: رفع عبر الموقع (الأسهل)

**أ) فك ضغط الملف على جهازك:**
```bash
# على Windows: انقر يمين → Extract All
# على Mac: انقر مرتين على الملف
# على Linux:
tar -xzf baby-gender-complete.tar.gz
```

**ب) رفع الملفات:**
1. في صفحة Repository على GitHub
2. اضغط **"Add file"** → **"Upload files"**
3. اسحب مجلد `baby-gender-complete` بالكامل
4. أو اضغط **"choose your files"** واختر جميع الملفات
5. في الأسفل، اكتب رسالة:
   ```
   Initial commit - Baby Gender Prediction App
   ```
6. اضغط **"Commit changes"**

### الطريقة 2: رفع عبر Git Terminal (للمحترفين)

**على جهازك:**

```bash
# 1. فك الضغط
tar -xzf baby-gender-complete.tar.gz
cd baby-gender-complete

# 2. تهيئة Git
git init

# 3. إضافة Remote
git remote add origin https://github.com/YOUR_USERNAME/baby-gender-app.git

# 4. إضافة الملفات
git add .

# 5. Commit
git commit -m "Initial commit - Baby Gender Prediction App"

# 6. Push
git branch -M main
git push -u origin main
```

**إذا طُلب منك تسجيل الدخول:**
- Username: اسم مستخدم GitHub
- Password: استخدم Personal Access Token (ليس كلمة المرور العادية)

**إنشاء Personal Access Token:**
1. اذهب إلى: https://github.com/settings/tokens
2. اضغط **"Generate new token (classic)"**
3. اختر Scopes: `repo`
4. اضغط **"Generate token"**
5. انسخ Token واستخدمه كـ password

---

## الخطوة 4: التحقق من نجاح الرفع

**على GitHub:**
1. اذهب إلى repository الخاص بك
2. تأكد من وجود:
   ```
   ✅ frontend/
   ✅ backend/
   ✅ README.md
   ✅ .gitignore
   ```

---

## الخطوة 5: تحميل المشروع من GitHub (في المستقبل)

**من أي جهاز:**

### الطريقة 1: Download ZIP
```
1. اذهب إلى repository
2. اضغط زر "Code" الأخضر
3. اختر "Download ZIP"
4. فك الضغط
```

### الطريقة 2: Git Clone
```bash
git clone https://github.com/YOUR_USERNAME/baby-gender-app.git
cd baby-gender-app
```

---

## بدائل إذا لم تستطع تحميل الملف المضغوط

### الطريقة اليدوية: نسخ الملفات واحداً واحداً

#### 1. إنشاء هيكل المجلدات على جهازك

**أنشئ المجلدات التالية:**
```
baby-gender-app/
├── frontend/
│   ├── app/
│   └── assets/
│       └── images/
└── backend/
```

#### 2. نسخ محتوى الملفات

**يمكنك الآن عرض محتوى أي ملف من خلالي:**

اطلب:
```
"اعرض محتوى /app/frontend/app/index.tsx"
"اعرض محتوى /app/backend/server.py"
```

ثم:
1. انسخ المحتوى
2. الصقه في ملف جديد على جهازك
3. احفظه بنفس الاسم

#### 3. الملفات المطلوبة (بالترتيب):

**Frontend:**
1. `/frontend/package.json`
2. `/frontend/app.json`
3. `/frontend/eas.json`
4. `/frontend/metro.config.js`
5. `/frontend/tsconfig.json`
6. `/frontend/.env`
7. `/frontend/app/index.tsx`
8. `/frontend/app/gender-prediction.tsx`
9. `/frontend/app/genetic-prediction.tsx`
10. `/frontend/app/traits-prediction.tsx`

**Backend:**
1. `/backend/requirements.txt`
2. `/backend/server.py`
3. `/backend/.env`

**الجذر:**
1. `README.md`
2. `.gitignore`

---

## نصائح مهمة 🔒

### 1. حماية المعلومات الحساسة

**قبل رفع أي شيء على GitHub:**

✅ تأكد من عدم وجود:
- مفاتيح API
- كلمات مرور
- روابط قواعد بيانات حقيقية

✅ في ملف `.env` استبدل:
```
EMERGENT_LLM_KEY=YOUR_KEY_HERE
MONGO_URL=mongodb://localhost:27017
```

### 2. اجعل Repository خاصاً

✅ في إعدادات Repository على GitHub:
- Settings → General
- Danger Zone → Change visibility
- اختر "Private"

### 3. نسخ احتياطية منتظمة

✅ بعد كل تحديث مهم:
```bash
git add .
git commit -m "تحديث: [وصف التحديث]"
git push
```

---

## خطوات النشر الكاملة (بعد رفع GitHub)

```
1. ✅ رفع المشروع على GitHub
2. ✅ استضافة Backend على (Railway/Render/Fly.io)
3. ✅ إنشاء MongoDB Atlas
4. ✅ تحديث .env بالروابط الحقيقية
5. ✅ بناء APK
6. ✅ تثبيت على الهاتف واختبار
7. ✅ رفع على Google Play Store
```

---

## الدعم

إذا واجهت أي مشكلة:
- اسأل الوكيل (أنا)
- Discord: https://discord.gg/VzKfwCXC4A
- Email: support@emergent.sh

---

**بالتوفيق! 🚀**
