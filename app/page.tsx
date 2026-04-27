import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center food-gradient page-shell">
      <div className="text-center p-8 rounded-3xl bg-white/90 shadow-lg backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">وجبات</h1>
        <p className="text-gray-600 mb-8">احجز وجبتك مسبقاً من أفضل المطاعم</p>
        <Link 
          href="/signup"
          className="
  text-2xl
  bg-[var(--primary-orange)]
  text-white
  px-8 py-3
  rounded-2xl  
  font-semibold
  opacity-90
  shadow-lg
  hover:opacity-100
  hover:shadow-xl
  hover:scale-105
h-10
  flex items-center justify-center
  transition-all
  duration-300
">
      ابدأ الآن
        </Link>
      </div>
    </main>
  );
}
