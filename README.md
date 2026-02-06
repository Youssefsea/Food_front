<div align="center">

# 🍔 Food Delivery App

### منصة توصيل الطعام المتكاملة

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="-----------------------------------------------------" />

**تطبيق متكامل لتوصيل الطعام يربط بين العملاء والمطاعم بتجربة سلسة وحديثة**

[🚀 البدء السريع](#-البدء-السريع) •
[✨ المميزات](#-المميزات) •
[📱 الصفحات](#-الصفحات) •
[🛠️ التقنيات](#️-التقنيات)

</div>

---

## 📋 نظرة عامة

تطبيق **Food Delivery** هو منصة متكاملة لتوصيل الطعام مبنية بأحدث التقنيات. يوفر التطبيق واجهتين رئيسيتين:

- 🛒 **واجهة العملاء**: لتصفح المطاعم، إضافة الأطباق للسلة، وإتمام الطلبات
- 🏪 **لوحة تحكم البائعين**: لإدارة المطعم، الأطباق، والطلبات

---

## ✨ المميزات

<table>
<tr>
<td width="50%">

### 👤 للعملاء
- 🔍 **استكشاف المطاعم** مع فلاتر متقدمة
- 🗺️ **تحديد الموقع بالـ GPS** مع حساب المسافة
- 🛒 **سلة ذكية** تدعم مطاعم متعددة
- 💳 **نظام دفع مرن** (فودافون كاش / إنستاباي)
- 📷 **رفع إثبات الدفع** مع معاينة الصورة
- 📅 **حجز مسبق** للمطاعم

</td>
<td width="50%">

### 🏪 للبائعين
- 📊 **لوحة تحكم شاملة** مع إحصائيات
- 🍽️ **إدارة الأطباق** (إضافة/تعديل/حذف)
- 📦 **إدارة الطلبات** مع تتبع الحالات
- ⚙️ **إعدادات المطعم** والموقع
- 🔔 **إشعارات فورية** للطلبات الجديدة
- 📈 **إحصائيات المبيعات** والأطباق الأكثر مبيعاً

</td>
</tr>
</table>

### 🌟 مميزات تقنية
- ⚡ **أداء فائق** مع Next.js 16 App Router
- 🎨 **تصميم عصري** متجاوب مع جميع الشاشات
- 🌙 **RTL Support** دعم كامل للغة العربية
- 🗺️ **خرائط تفاعلية** مع Leaflet
- ✨ **انيميشن سلس** مع Framer Motion
- 🔒 **مصادقة آمنة** مع JWT

---

## 📱 الصفحات

### 🛒 واجهة العملاء

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| 🏠 **الاستكشاف** | `/explore` | تصفح المطاعم مع البحث والفلاتر |
| 🍽️ **المطعم** | `/restaurant/[name]` | عرض قائمة الأطباق مع التفاصيل |
| 🛒 **السلة** | `/cart` | إدارة السلة وإتمام الطلب |
| 🔐 **تسجيل الدخول** | `/login` | صفحة تسجيل الدخول |
| 📝 **إنشاء حساب** | `/signup` | التسجيل كعميل أو بائع |

### 🏪 لوحة تحكم البائعين

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| 📊 **لوحة التحكم** | `/vendor/dashboard` | الإحصائيات والنظرة العامة |
| 🍽️ **الأطباق** | `/vendor/dishes` | إدارة قائمة الأطباق |
| 📦 **الطلبات** | `/vendor/orders` | إدارة ومتابعة الطلبات |
| ⚙️ **الإعدادات** | `/vendor/EditAtVendorInfo` | إعدادات المطعم والحساب |

---

## 🛠️ التقنيات

<div align="center">

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) | 16.1.4 | إطار العمل الرئيسي |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | 19.2.3 | مكتبة واجهات المستخدم |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.x | Type Safety |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | 4.x | التصميم والتنسيق |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | 12.x | الانيميشن |
| ![Leaflet](https://img.shields.io/badge/-Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white) | 1.9.4 | الخرائط التفاعلية |
| ![Lucide](https://img.shields.io/badge/-Lucide_Icons-F56565?style=flat-square) | 0.563 | الأيقونات |

</div>

---

## 🚀 البدء السريع

### المتطلبات

- **Node.js** >= 18.0.0
- **npm** أو **yarn** أو **pnpm**

### التثبيت

```bash
# 1️⃣ استنساخ المشروع
git clone https://github.com/Youssefsea/Food_front.git

# 2️⃣ الانتقال للمجلد
cd Food_front/frontend

# 3️⃣ تثبيت المكتبات
npm install

# 4️⃣ تشغيل التطبيق
npm run dev
```

التطبيق سيعمل على: **http://localhost:3000**

### 🔧 إعداد البيئة

أنشئ ملف `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3444
```

---

## 📁 هيكل المشروع

```
frontend/
├── 📂 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # التخطيط الرئيسي
│   ├── 📄 page.tsx                  # الصفحة الرئيسية
│   ├── 📄 globals.css               # الأنماط العامة
│   │
│   ├── 📂 cart/                     # 🛒 صفحة السلة
│   │   ├── 📄 page.tsx
│   │   ├── 📄 types.ts
│   │   └── 📂 components/
│   │       ├── CartHeader.tsx
│   │       ├── CheckoutButton.tsx
│   │       ├── DeliveryLocation.tsx
│   │       ├── DishItem.tsx
│   │       ├── LocationPickerModal.tsx
│   │       ├── OrderSummary.tsx
│   │       ├── PaymentMethod.tsx
│   │       ├── PaymentProofUpload.tsx
│   │       └── RestaurantSelector.tsx
│   │
│   ├── 📂 explore/                  # 🔍 استكشاف المطاعم
│   │   ├── 📄 page.tsx
│   │   └── 📂 componentForExplore/
│   │       ├── Header.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterChips.tsx
│   │       ├── RestaurantCard.tsx
│   │       └── BottomNavigation.tsx
│   │
│   ├── 📂 restaurant/               # 🍽️ صفحة المطعم
│   │   └── 📂 [restaurant_name]/
│   │       ├── 📄 page.tsx
│   │       └── 📂 components/
│   │           ├── CategoryTabs.tsx
│   │           ├── DishCard.tsx
│   │           ├── DishDetailModal.tsx
│   │           └── FloatingCartBar.tsx
│   │
│   ├── 📂 vendor/                   # 🏪 لوحة تحكم البائعين
│   │   ├── 📂 dashboard/
│   │   │   ├── 📄 page.tsx
│   │   │   └── 📂 components/
│   │   │       ├── DashboardHeader.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── StatsCards.tsx
│   │   │       ├── RecentOrdersTable.tsx
│   │   │       └── TopSellingDishes.tsx
│   │   │
│   │   ├── 📂 dishes/               # إدارة الأطباق
│   │   ├── 📂 orders/               # إدارة الطلبات
│   │   └── 📂 EditAtVendorInfo/     # الإعدادات
│   │
│   ├── 📂 login/                    # 🔐 تسجيل الدخول
│   └── 📂 signup/                   # 📝 إنشاء حساب
│       ├── 📂 customer/
│       └── 📂 vendor/
│
├── 📄 axios.js                      # إعداد Axios
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
└── 📄 next.config.ts
```

---

## 🔌 API Endpoints

### 👤 العملاء

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `POST` | `/customer/login` | تسجيل الدخول |
| `POST` | `/customer/signup` | إنشاء حساب جديد |
| `GET` | `/customer/all-restaurants` | جلب جميع المطاعم |
| `GET` | `/customer/restaurant/:name` | تفاصيل مطعم |
| `GET` | `/customer/view-cart` | عرض السلة |
| `POST` | `/customer/add-to-cart` | إضافة للسلة |
| `PUT` | `/customer/update-dish-quantity-in-cart` | تعديل الكمية |
| `DELETE` | `/customer/remove-dish-from-cart` | حذف من السلة |
| `POST` | `/customer/place-order` | إنشاء طلب |
| `POST` | `/customer/upload-payment-proof` | رفع إثبات الدفع |

### 🏪 البائعين

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `POST` | `/vendor/login` | تسجيل الدخول |
| `GET` | `/vendor/dashboard` | بيانات لوحة التحكم |
| `GET` | `/vendor/dishes` | جلب الأطباق |
| `POST` | `/vendor/add-dish` | إضافة طبق |
| `PUT` | `/vendor/update-dish` | تعديل طبق |
| `DELETE` | `/vendor/delete-dish` | حذف طبق |
| `GET` | `/vendor/orders` | جلب الطلبات |
| `PUT` | `/vendor/update-order-status` | تحديث حالة الطلب |

---

## 🎨 التصميم

### 🎨 الألوان الرئيسية

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| 🟠 **Primary** | `#E5A04D` | اللون الأساسي |
| ⚫ **Dark** | `#1A1A1A` | النصوص الرئيسية |
| ⚪ **Gray** | `#6B7280` | النصوص الثانوية |
| 🟢 **Success** | `#10B981` | حالات النجاح |
| 🔴 **Error** | `#EF4444` | حالات الخطأ |

### 📱 Responsive Design

التطبيق متجاوب مع جميع أحجام الشاشات:

- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+

---

## 🧪 الأوامر المتاحة

```bash
# 🔧 التطوير
npm run dev          # تشغيل وضع التطوير

# 🏗️ البناء
npm run build        # بناء المشروع للإنتاج

# 🚀 التشغيل
npm run start        # تشغيل وضع الإنتاج

# 🔍 الفحص
npm run lint         # فحص الأكواد
```

---

## 📝 ملاحظات مهمة

### 💳 نظام الدفع
- يدعم التطبيق **فودافون كاش** و **إنستاباي**
- يتطلب رفع صورة إثبات الدفع قبل تأكيد الطلب

### 🗺️ نظام تحديد الموقع
- يستخدم GPS لتحديد موقع العميل
- يحسب المسافة بين العميل والمطعم باستخدام **Haversine Formula**
- رسوم التوصيل = المسافة × رسوم الكيلومتر

### 🛒 السلة الذكية
- تدعم إضافة أطباق من مطاعم متعددة
- عند الطلب، يجب اختيار مطعم واحد فقط
- يمكن العودة لطلب باقي المطاعم بعد إتمام الطلب الأول

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork** المشروع
2. أنشئ **Branch** جديد (`git checkout -b feature/amazing-feature`)
3. **Commit** التغييرات (`git commit -m 'Add amazing feature'`)
4. **Push** إلى الـ Branch (`git push origin feature/amazing-feature`)
5. افتح **Pull Request**

---

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة **MIT** - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

<div align="center">

### 💖 شكراً لاستخدامك التطبيق!

**صنع بـ ❤️ في مصر 🇪🇬**

[![GitHub stars](https://img.shields.io/github/stars/Youssefsea/Food_front?style=social)](https://github.com/Youssefsea/Food_front/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Youssefsea/Food_front?style=social)](https://github.com/Youssefsea/Food_front/network/members)

</div>
