import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CubeIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Interventions', href: '/interventions', icon: ClipboardDocumentListIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Stock', href: '/inventory', icon: CubeIcon },
  { name: 'Calendrier', href: '/calendar', icon: CalendarIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">GALAND Plomberie</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 hover:bg-primary-600 px-3 py-2 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
          <nav className="mt-5 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1
                    ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-4 h-6 w-6
                      ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
