'use client';

import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
  className?: string;
}

export default function Breadcrumb({ crumbs, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap ${className}`}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-[#E5A04D] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          )}
          {i < crumbs.length - 1 && <span className="text-gray-300">/</span>}
        </span>
      ))}
    </nav>
  );
}
