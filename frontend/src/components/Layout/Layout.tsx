import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode; // Define the type of children here
}

const links = [
    { name: 'Profile', path: '/profile' },
    { name: 'Events', path: '/events' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Shop', path: '/shop' },
    { name: 'News', path: '/news' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Dollys', path: '/dollys' },
  ];

const Layout: React.FC<LayoutProps> = ({ children }) => { // Use LayoutProps here
  const { pathname } = useRouter();

  return (
    <div className="layout">
      <nav className="flex flex-col homerow items-center justify-center space-y-2">
      {links.map((link) => (
        <Link legacyBehavior key={link.path} href={link.path}>
            <a className={pathname === link.path ? 'active' : ''}>{link.name}</a>
        </Link>
        ))}
      </nav>
      <main>{children}</main>
      {/* Add any additional common layout elements here */}
    </div>
  );
};

export default Layout;
