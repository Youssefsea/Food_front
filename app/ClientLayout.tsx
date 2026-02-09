'use client';

import { usePathname } from "next/navigation";
import { BottomNavigation } from "./explore/componentForExplore/BottomNavigation";

export default function ClientLayout() {
  const pathname = usePathname();

  const showBottomNav =
    pathname.startsWith("/explore") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/orders") ;

  if (!showBottomNav) return null;

  return <BottomNavigation />;
}
