import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">وجبات</h1>
        <p className="text-gray-600 mb-8">احجز وجبتك مسبقاً من أفضل المطاعم</p>
        <Link 
          href="/signup"
          className="
  text-2xl
  bg-[#E5A04D]
  text-white
  px-8 py-3
  rounded-full  
  font-semibold
  opacity-90
  shadow-lg
  hover:opacity-100
  hover:shadow-xl
  hover:scale-80
h-10
  flex items-center justify-center
  transition-all
  duration-400
">
      ابدأ الآن
        </Link>
      </div>
    </main>
  );
}
