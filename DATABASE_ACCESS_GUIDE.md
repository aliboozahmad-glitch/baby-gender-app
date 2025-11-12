# 📊 دليل الوصول إلى قاعدة البيانات

## معلومات قاعدة البيانات الحالية

**الموقع:** MongoDB داخل بيئة Emergent
**اسم قاعدة البيانات:** test_database
**اسم الجدول (Collection):** predictions

---

## 🔍 كيفية الوصول إلى البيانات

### الطريقة 1: عبر API Endpoints (الأسهل)

#### 1. إحصائيات قاعدة البيانات
```bash
# الحصول على عدد التوقعات
curl https://baby-gender-predict.preview.emergentagent.com/api/statistics
```

**النتيجة:**
```json
{
  "total_predictions": 20,
  "by_type": {
    "gender": 12,
    "genetic": 7,
    "traits": 1
  }
}
```

#### 2. آخر 50 توقع
```bash
curl https://baby-gender-predict.preview.emergentagent.com/api/history
```

#### 3. تصدير جميع البيانات (للمصمم فقط)
```bash
curl https://baby-gender-predict.preview.emergentagent.com/api/export-all-data > all_data.json
```

هذا سيحفظ **جميع** البيانات في ملف JSON يحتوي على:
- جميع التوقعات
- الشروحات التفصيلية من AI
- الأنماط والتحليلات
- البيانات المخفية عن المستخدمين

---

## 📥 تصدير البيانات من المتصفح

### الطريقة البسيطة:

1. افتح المتصفح
2. اذهب إلى:
   ```
   https://baby-gender-predict.preview.emergentagent.com/api/export-all-data
   ```
3. انسخ كل المحتوى
4. احفظه في ملف نصي باسم `data.json`

---

## 💾 نقل قاعدة البيانات للإنتاج

عندما تريد نشر التطبيق بشكل حقيقي، تحتاج قاعدة بيانات على الإنترنت:

### الخيار 1: MongoDB Atlas (مجاني + مدفوع)

**المميزات:**
- ✅ 512 MB مجاناً
- ✅ سهل الاستخدام
- ✅ موثوق وآمن

**الخطوات:**

1. **التسجيل:**
   - اذهب إلى: https://www.mongodb.com/cloud/atlas/register
   - سجّل بالبريد الإلكتروني

2. **إنشاء Cluster:**
   - اختر "Create a FREE Cluster"
   - اختر المنطقة الأقرب (مثل: AWS - Bahrain)
   - اضغط "Create Cluster"

3. **إعداد الوصول:**
   - Database Access → Add New Database User
   - أنشئ username و password (احفظهم!)
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

4. **الحصول على Connection String:**
   - اضغط "Connect" على cluster الخاص بك
   - اختر "Connect your application"
   - انسخ الرابط مثل:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/baby_gender_db
   ```

5. **تحديث Backend:**
   - في ملف `/app/backend/.env`
   - استبدل `MONGO_URL`:
   ```
   MONGO_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/baby_gender_db"
   DB_NAME="baby_gender_db"
   ```

---

### الخيار 2: نقل البيانات الحالية إلى Atlas

**بعد إنشاء قاعدة بيانات Atlas:**

1. **تصدير البيانات الحالية:**
```bash
curl http://localhost:8001/api/export-all-data > backup.json
```

2. **استيراد البيانات إلى Atlas:**
```bash
# تثبيت MongoDB Tools
# ثم استخدام mongoimport
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/baby_gender_db" \
  --collection predictions \
  --file backup.json \
  --jsonArray
```

---

## 🗂️ هيكل البيانات المحفوظة

### مثال على سجل توقع نوع الجنين:

```json
{
  "id": "unique-id-123",
  "type": "gender",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "current_pregnancy_order": 2,
    "wife_family_children": [
      {"order": 1, "gender": "male"},
      {"order": 2, "gender": "female"}
    ],
    "husband_family_children": [
      {"order": 1, "gender": "male"},
      {"order": 2, "gender": "female"}
    ],
    "language": "ar"
  },
  "result": {
    "predicted_gender": "female",
    "confidence": "high",
    "confidence_percentage": 85,
    "explanation": "شرح تفصيلي من AI محفوظ للمصمم فقط...",
    "wife_pattern": ["male", "female"],
    "husband_pattern": ["male", "female"],
    "proprietary_info": "حقوق ملكية فكرية - للمصمم فقط"
  }
}
```

### ما يراه المستخدم في التطبيق:
```json
{
  "predicted_gender": "female",
  "confidence_percentage": 85
}
```

### ما هو محفوظ في قاعدة البيانات (للمصمم):
```json
{
  "predicted_gender": "female",
  "confidence": "high",
  "confidence_percentage": 85,
  "explanation": "الشرح الكامل من AI...",
  "wife_pattern": ["male", "female"],
  "husband_pattern": ["male", "female"],
  "proprietary_info": "حقوق ملكية فكرية"
}
```

---

## 🔐 حماية البيانات

### نصائح الأمان:

1. **لا تشارك Connection String:**
   - يحتوي على username و password
   - احفظه في مكان آمن

2. **استخدم متغيرات البيئة:**
   - لا تضع الرابط في الكود مباشرة
   - استخدم ملف `.env`

3. **نسخ احتياطي منتظم:**
   - صدّر البيانات كل فترة
   - احفظها في مكان آمن

---

## 📊 استعلامات مفيدة

### عرض آخر 10 توقعات لنوع الجنين:
```bash
curl "https://baby-gender-predict.preview.emergentagent.com/api/history" | \
  jq '.[] | select(.type == "gender") | {timestamp, predicted_gender: .result.predicted_gender}'
```

### حساب معدل النجاح:
يمكنك تحليل البيانات المصدرة لمعرفة:
- كم عدد التوقعات الإجمالية
- النسب المئوية الأكثر شيوعاً
- أكثر الصفات الوراثية المتوقعة

---

## 🔄 نقل التطبيق للإنتاج - خطة كاملة

### 1. قاعدة البيانات:
- ✅ انتقل من localhost إلى MongoDB Atlas
- ✅ صدّر البيانات الحالية
- ✅ استوردها في Atlas

### 2. Backend:
- ✅ رفع Backend على سيرفر (Heroku, Railway, DigitalOcean)
- ✅ تحديث MONGO_URL في ملف `.env`
- ✅ تحديث EMERGENT_LLM_KEY

### 3. Frontend (APK):
- ✅ تحديث EXPO_PUBLIC_BACKEND_URL في ملف `.env`
- ✅ بناء APK جديد بالرابط الحقيقي
- ✅ اختبار الاتصال

### 4. النشر:
- ✅ رفع APK على Google Play
- ✅ اختبار جميع الميزات
- ✅ نشر التطبيق للعامة

---

## 📞 خدمات استضافة Backend مجانية

### 1. Railway (موصى به)
- مجاني لحد معين
- سهل الاستخدام
- https://railway.app

### 2. Render
- مجاني تماماً
- قد يكون بطيء قليلاً
- https://render.com

### 3. Fly.io
- مجاني لمشروع واحد
- سريع
- https://fly.io

---

## ملخص سريع

**لعرض البيانات الآن:**
```
افتح: https://baby-gender-predict.preview.emergentagent.com/api/export-all-data
```

**عدد السجلات الحالية:**
- 20 توقع إجمالي
- 12 توقع لنوع الجنين
- 7 توقع للأمراض الوراثية
- 1 توقع للصفات الوراثية

**جميع البيانات محفوظة وآمنة ومتاحة للتصدير! ✅**
