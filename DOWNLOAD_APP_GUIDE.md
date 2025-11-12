# 📥 دليل تحميل التطبيق من Emergent

## الطريقة الموصى بها: GitHub

### الخطوة 1: حفظ المشروع على GitHub

**من واجهة Emergent:**
1. ابحث عن زر **"Save to GitHub"** أو **"Push to GitHub"**
2. اضغط عليه
3. سجّل الدخول إلى GitHub (أو أنشئ حساب مجاني)
4. سيتم إنشاء repository جديد

### الخطوة 2: تحميل المشروع

**الطريقة 1: باستخدام Git (إذا كان مثبتاً)**

```bash
# افتح Terminal
# انتقل للمكان الذي تريد حفظ المشروع فيه
cd Desktop

# استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# ادخل للمجلد
cd YOUR_REPO_NAME
```

**الطريقة 2: تحميل ZIP (الأسهل)**

1. اذهب إلى repository على GitHub
2. اضغط على الزر الأخضر **"Code"**
3. اختر **"Download ZIP"**
4. حمّل الملف
5. فك الضغط عن الملف

---

## البديل: إنشاء المشروع يدوياً

إذا لم تستطع استخدام GitHub، اتبع هذه الخطوات:

### الخطوة 1: إنشاء هيكل المجلدات

**على جهازك:**

1. أنشئ مجلد جديد اسمه `baby-gender-app`
2. داخله أنشئ مجلدين:
   - `frontend`
   - `backend`

### الخطوة 2: ملفات Frontend

#### أ) package.json

أنشئ ملف `/frontend/package.json`:

```json
{
  "name": "baby-gender-predict",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.11",
    "expo-router": "~4.0.9",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "expo-linear-gradient": "~14.0.1",
    "axios": "^1.7.9",
    "@expo/vector-icons": "^14.0.4"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "^5.3.3"
  }
}
```

#### ب) app.json

أنشئ ملف `/frontend/app.json`:

```json
{
  "expo": {
    "name": "Baby Gender Prediction",
    "slug": "baby-gender-predict",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "babygenderpredict",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.babygenderpredict.app"
    },
    "android": {
      "package": "com.babygenderpredict.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FFB6C1"
      },
      "permissions": []
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### ج) eas.json

أنشئ ملف `/frontend/eas.json`:

```json
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### د) .env

أنشئ ملف `/frontend/.env`:

```
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

**ملاحظة:** عند بناء APK للإنتاج، غيّر هذا إلى رابط سيرفر حقيقي

#### هـ) metro.config.js

أنشئ ملف `/frontend/metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

#### و) tsconfig.json

أنشئ ملف `/frontend/tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### الخطوة 3: ملفات الكود الرئيسية

**الآن تحتاج نسخ محتوى الملفات من Emergent:**

يمكنك الوصول إلى الملفات في Emergent وعرضها، ثم:

1. **`/frontend/app/index.tsx`** - الصفحة الرئيسية
2. **`/frontend/app/gender-prediction.tsx`** - صفحة توقع الجنس
3. **`/frontend/app/genetic-prediction.tsx`** - صفحة الأمراض الوراثية
4. **`/frontend/app/traits-prediction.tsx`** - صفحة الصفات الوراثية

انسخ كل ملف وضعه في نفس المسار على جهازك.

### الخطوة 4: ملفات Backend

#### أ) requirements.txt

أنشئ ملف `/backend/requirements.txt`:

```
fastapi==0.115.5
uvicorn==0.32.1
motor==3.6.0
python-dotenv==1.0.1
pydantic==2.10.2
emergentintegrations
```

#### ب) server.py

انسخ محتوى `/app/backend/server.py` من Emergent

#### ج) .env

أنشئ ملف `/backend/.env`:

```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="baby_gender_db"
EMERGENT_LLM_KEY=sk-emergent-cE6C3B2B9DaEf25111
```

### الخطوة 5: الأيقونات

تحتاج أيقونات في `/frontend/assets/images/`:

**يمكنك:**
1. تحميل أيقونات من Emergent
2. أو إنشاء أيقونات جديدة:
   - `icon.png` (1024x1024)
   - `adaptive-icon.png` (1024x1024)
   - `splash-icon.png` (200x200)

**مواقع مجانية للأيقونات:**
- https://www.flaticon.com
- https://icons8.com

---

## التحقق من اكتمال الملفات

بعد نسخ كل الملفات، تأكد من وجود:

```
baby-gender-app/
├── frontend/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── gender-prediction.tsx
│   │   ├── genetic-prediction.tsx
│   │   └── traits-prediction.tsx
│   ├── assets/
│   │   └── images/
│   │       ├── icon.png
│   │       ├── adaptive-icon.png
│   │       └── splash-icon.png
│   ├── .env
│   ├── app.json
│   ├── eas.json
│   ├── metro.config.js
│   ├── package.json
│   └── tsconfig.json
└── backend/
    ├── .env
    ├── server.py
    └── requirements.txt
```

---

## الخطوة التالية: بناء APK

بعد تحميل المشروع:

### 1. تثبيت المكتبات

```bash
# افتح Terminal في مجلد frontend
cd frontend

# تثبيت المكتبات
npm install
# أو
yarn install
```

### 2. بناء APK

```bash
# تسجيل الدخول
eas login

# البناء
eas build --platform android --profile preview
```

---

## نصائح مهمة

### 1. لا تنسَ تحديث BACKEND_URL

عند بناء APK للإنتاج:

**في `/frontend/.env`:**
```
EXPO_PUBLIC_BACKEND_URL=https://your-real-server.com
```

### 2. Backend يحتاج سيرفر

Backend الحالي يعمل على localhost. للإنتاج:
- رفعه على Railway / Render / Fly.io
- تحديث MongoDB إلى Atlas

### 3. احفظ نسخة احتياطية

بعد تحميل المشروع:
- ضعه على GitHub
- احفظه على Google Drive
- أو على قرص خارجي

---

## إذا واجهتك مشاكل

### المشكلة: "لا أستطيع الوصول للكود"
**الحل:** اطلب من فريق Emergent خاصية التصدير

### المشكلة: "الملفات كثيرة"
**الحل:** ركز على الملفات الأساسية فقط (المذكورة أعلاه)

### المشكلة: "أريد طريقة أسهل"
**الحل:** استخدم خاصية "Save to GitHub" في Emergent

---

## خدمات مساعدة

إذا كنت لا تريد القيام بهذا يدوياً:

1. **Fiverr** - ابحث عن مطور Expo (50-100$)
2. **مستقل** - مطورين عرب (100-300 ريال)

سيقومون بـ:
- تحميل الكود
- بناء APK
- رفعه على Google Play

---

## ملخص سريع

1. ✅ احفظ المشروع على GitHub (الأسهل)
2. ✅ أو انسخ الملفات يدوياً
3. ✅ تأكد من جميع الملفات موجودة
4. ✅ ثبّت المكتبات (`npm install`)
5. ✅ ابنِ APK (`eas build`)

**بالتوفيق! 🚀**
