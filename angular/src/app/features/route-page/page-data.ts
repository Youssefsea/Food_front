import { FeaturePageData } from '../../core/models/common.models';

export const PAGE_DATA: Record<string, FeaturePageData> = {
  home: {
    title: 'منصة أكلي',
    subtitle: 'تجربة توصيل طعام حديثة للعملاء والمطاعم.',
    quickActions: [
      { label: 'استكشف المطاعم', link: '/explore' },
      { label: 'تسجيل الدخول', link: '/login' }
    ],
    sections: [
      { title: 'واجهة العملاء', description: 'تصفح المطاعم، إدارة السلة، وتتبع الطلبات بشكل فوري.' },
      { title: 'لوحة المطاعم', description: 'إدارة الأطباق والطلبات والإحصائيات من واجهة موحدة.' }
    ]
  },
  explore: {
    title: 'استكشف المطاعم',
    subtitle: 'بحث، فلاتر، بطاقات مطاعم، وتجربة متجاوبة كما في المشروع الأصلي.',
    sections: [
      { title: 'فلاتر متقدمة', description: 'عرض المطاعم حسب المسافة، التوصيل، ونوع الخدمة.' },
      { title: 'بطاقات المطاعم', description: 'معلومات تفصيلية عن كل مطعم مع وقت العمل والتقييم.' }
    ]
  },
  cart: {
    title: 'السلة',
    subtitle: 'تجميع الأطباق، اختيار طريقة الدفع، وإرسال الطلب.',
    sections: [
      { title: 'تفاصيل الطلب', description: 'عناصر السلة، الكميات، والتكلفة النهائية.' },
      { title: 'الدفع', description: 'رفع إثبات الدفع واختيار طريقة الدفع.' }
    ]
  },
  login: {
    title: 'تسجيل الدخول',
    subtitle: 'دخول العميل أو المطعم أو المدير.',
    sections: [
      { title: 'مصادقة آمنة', description: 'إدارة التوكن محليًا وربطه بحالة التطبيق.' }
    ]
  },
  signup: {
    title: 'إنشاء حساب',
    subtitle: 'التسجيل كعميل أو مطعم.',
    sections: [
      { title: 'حساب عميل', description: 'إدخال البيانات الأساسية والبدء في الطلب.' },
      { title: 'حساب مطعم', description: 'إعداد بيانات المطعم وموقعه وسياسات التوصيل.' }
    ]
  },
  profile: {
    title: 'الملف الشخصي',
    subtitle: 'معلومات الحساب، الطلبات، والمحفظة.',
    sections: [
      { title: 'البيانات الشخصية', description: 'تعديل الاسم ورقم الهاتف وإدارة الملف.' },
      { title: 'سجل الطلبات', description: 'متابعة كل طلب وحالته بشكل منظم.' }
    ]
  },
  orders: {
    title: 'الطلبات',
    subtitle: 'متابعة حالة الطلبات للعميل أو المطعم.',
    sections: [
      { title: 'حالات الطلب', description: 'pending / paid / cooking / delivering / completed.' }
    ]
  },
  payment: {
    title: 'الدفع',
    subtitle: 'تأكيد المدفوعات وإرفاق إثبات الدفع.',
    sections: [{ title: 'إثبات الدفع', description: 'رفع الصور وربطها بالطلب.' }]
  },
  chat: {
    title: 'المحادثات',
    subtitle: 'غرف تواصل بين العميل والمطعم.',
    sections: [{ title: 'غرف المحادثة', description: 'فتح غرفة ومتابعة الرسائل حسب الطلب.' }]
  },
  vendorDashboard: {
    title: 'لوحة تحكم المطعم',
    subtitle: 'إحصائيات سريعة ومؤشرات الأداء.',
    sections: [
      { title: 'إحصائيات يومية', description: 'إجمالي الطلبات والمبيعات والأطباق المتاحة.' },
      { title: 'أحدث الطلبات', description: 'جدول الطلبات وآخر النشاطات.' }
    ]
  },
  vendorDishes: {
    title: 'إدارة الأطباق',
    subtitle: 'إضافة، تعديل، حذف، وتبديل حالة التوفر.',
    sections: [
      { title: 'قائمة الأطباق', description: 'بطاقات أطباق مع التحكم الكامل.' },
      { title: 'نماذج الإدارة', description: 'نماذج إضافة وتعديل مع التحقق من البيانات.' }
    ]
  },
  vendorOrders: {
    title: 'إدارة طلبات المطعم',
    subtitle: 'فلترة الطلبات وتحديث الحالة.',
    sections: [
      { title: 'فلترة الحالات', description: 'عرض حسب الحالة والتاريخ.' },
      { title: 'تفاصيل الطلب', description: 'تفاصيل العميل والأطباق وطرق التواصل.' }
    ]
  },
  vendorProfile: {
    title: 'إعدادات المطعم',
    subtitle: 'البيانات الأساسية، الموقع، التسعير، والأمان.',
    sections: [
      { title: 'بيانات المطعم', description: 'الاسم، الوصف، ساعات العمل.' },
      { title: 'نطاق التوصيل', description: 'تحديد نصف القطر ورسوم التوصيل.' }
    ]
  },
  restaurantDetail: {
    title: 'صفحة المطعم',
    subtitle: 'تصنيفات وأطباق وتفاصيل المنتج.',
    sections: [
      { title: 'التصنيفات', description: 'عرض الأطباق حسب التصنيف.' },
      { title: 'تفاصيل الطبق', description: 'مودال للصور والوصف والإضافات.' }
    ]
  },
  admin: {
    title: 'لوحة الإدارة',
    subtitle: 'مراجعة وإدارة المدفوعات.',
    sections: [{ title: 'المدفوعات', description: 'اعتماد أو رفض إثباتات الدفع.' }]
  }
};
