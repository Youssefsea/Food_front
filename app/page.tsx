import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        
        {/* Floating Food Emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[8%] text-5xl md:text-7xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>🍕</div>
          <div className="absolute top-[25%] left-[10%] text-4xl md:text-6xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🍔</div>
          <div className="absolute bottom-[30%] right-[15%] text-4xl md:text-5xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>🌮</div>
          <div className="absolute bottom-[15%] left-[20%] text-3xl md:text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🥙</div>
          <div className="absolute top-[50%] right-[40%] text-3xl md:text-4xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🧆</div>
          <div className="absolute top-[15%] left-[35%] text-3xl md:text-4xl opacity-10 animate-float" style={{ animationDelay: '2.5s' }}>🍗</div>
          
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white/3" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-6 animate-fadeIn">
            <span className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              أكلي
            </span>
            <span className="text-4xl md:text-6xl ml-2">🍕</span>
          </div>

          {/* Tagline */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-relaxed animate-slideUp">
            اطلب أكلك المفضل
            <br />
            <span className="text-white/80 text-lg md:text-2xl font-medium">
              من أفضل المطاعم حواليك
            </span>
          </h1>

          <p className="text-white/70 text-sm md:text-base mb-10 max-w-md mx-auto animate-slideUp" style={{ animationDelay: '0.1s' }}>
            اكتشف مطاعم قريبة منك، اطلب، وتوصلك لحد الباب
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/customer/home"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#FF6B35] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-center"
            >
              استكشف المطاعم 🔍
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/25 transition-all duration-300 text-center"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-white/60 text-sm animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            عندك حساب بالفعل؟{' '}
            <Link href="/login" className="text-white underline underline-offset-4 hover:text-white/90 font-medium">
              سجّل دخول
            </Link>
          </p>
        </div>

        {/* Wave separator */}
        <svg className="absolute bottom-0 left-0 right-0 h-12 md:h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
          <path d="M0 64h1440V32c-120 16-360 32-720 32S120 48 0 32v32z" fill="#FAFAFA" />
        </svg>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            كيف يعمل أكلي؟
          </h2>
          <p className="text-[#6B7280] text-center mb-12 md:mb-16 max-w-md mx-auto">
            ثلاث خطوات بسيطة وأكلك يوصلك
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔍</span>
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs font-bold mb-3">1</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">اكتشف</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                تصفح المطاعم القريبة منك واختار أكلك المفضل
              </p>
            </div>

            {/* Step 2 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🛒</span>
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E63946] text-white text-xs font-bold mb-3">2</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">اطلب</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                ضيف الأطباق للسلة واعمل الأوردر بسهولة
              </p>
            </div>

            {/* Step 3 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚗</span>
              </div>
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981] text-white text-xs font-bold mb-3">3</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">استلم</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                تابع طلبك لحظة بلحظة واستلمه عند بابك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Restaurants CTA */}
      <section className="py-12 md:py-16 px-6 bg-gradient-to-br from-[#1A1A2E] to-[#252540]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-4xl mb-4 block">🏪</span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            عندك مطعم؟ انضم لأكلي!
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            سجّل مطعمك واستقبل طلبات من آلاف العملاء
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#E63946] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            سجّل مطعمك الآن
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <div className="text-gradient text-xl font-bold mb-2">أكلي 🍕</div>
        <p className="text-xs text-[#9CA3AF]">© 2026 Akly. جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
