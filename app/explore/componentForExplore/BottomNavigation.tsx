import { Home, Search, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { id: 1, label: 'الرئيسية', icon: Home, active: false },
  { id: 2, label: 'استكشف', icon: Search, active: true },
  { id: 3, label: 'الطلبات', icon: ShoppingBag, active: false },
  { id: 4, label: 'الملف', icon: User, active: false },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-1 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 shadow-lg">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all ${
                  item.active ? 'text-[#E5A04D]' : 'text-[#9CA3AF]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    item.active ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
