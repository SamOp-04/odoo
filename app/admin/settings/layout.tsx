'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Clock, Tag, Users } from 'lucide-react';

interface SettingsNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const settingsNavItems: SettingsNavItem[] = [
  {
    title: 'Rental Periods',
    href: '/admin/settings/rental-periods',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: 'Attributes',
    href: '/admin/settings/attributes',
    icon: <Tag className="w-5 h-5" />,
  },
  {
    title: 'Users',
    href: '/admin/settings/users',
    icon: <Users className="w-5 h-5" />,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Navigation */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-black border border-white rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Settings</h2>
          </div>

          <nav className="space-y-2">
            {settingsNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Right Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
