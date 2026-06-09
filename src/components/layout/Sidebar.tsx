import { NavLink } from 'react-router';
import { X, LogIn, UserPlus, User, ChevronRight, Users, Package, ShoppingCart, UserCheck, FolderKanban, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: 'Login Form',
    path: '/',
    icon: <LogIn size={16} />,
    description: 'Authentication with server errors',
  },
  {
    label: 'Register Form',
    path: '/register',
    icon: <UserPlus size={16} />,
    badge: 'New',
    description: 'Registration with password strength',
  },
  {
    label: 'User Profile',
    path: '/user',
    icon: <User size={16} />,
    description: 'Full CRUD with sections & switches',
  },
];

const resourceNavItems: NavItem[] = [
  {
    label: 'Getting Started',
    path: '/getting-started',
    icon: <BookOpen size={16} />,
    description: 'Framework setup & installation',
  },
  {
    label: 'Users',
    path: '/resource/users',
    icon: <Users size={16} />,
    description: 'Generated User accounts',
  },
  {
    label: 'Products',
    path: '/resource/products',
    icon: <Package size={16} />,
    description: 'Generated Product catalog',
  },
  {
    label: 'Orders',
    path: '/resource/orders',
    icon: <ShoppingCart size={16} />,
    description: 'Generated Order processing',
  },
  {
    label: 'Customers',
    path: '/resource/customers',
    icon: <UserCheck size={16} />,
    description: 'Generated Customer profiles',
  },
  {
    label: 'Teams',
    path: '/resource/teams',
    icon: <Users size={16} />,
    description: 'Generated Team listings',
  },
  {
    label: 'Projects',
    path: '/resource/projects',
    icon: <FolderKanban size={16} />,
    description: 'Generated Project scopes',
  },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Form templates navigation"
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/60 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-lg lg:shadow-none z-20`}
      >
        <div className="h-full overflow-y-auto p-5 scrollbar-thin">
          {/* Mobile header */}
          <div className="flex justify-between items-center mb-5 lg:hidden">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider">
              Templates
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Desktop section label */}
          <p className="hidden lg:block text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-4 px-1">
            Form Templates
          </p>

          <ul className="space-y-1 mb-6" role="list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="badge badge-primary text-[10px] px-1.5 py-0.5">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs mt-0.5 block truncate transition-colors ${
                            isActive
                              ? 'text-primary-500 dark:text-primary-400 opacity-80'
                              : 'text-surface-400 dark:text-surface-500'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100 text-primary-400' : 'opacity-0 group-hover:opacity-50'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ResourceFlow section label */}
          <p className="hidden lg:block text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500 mb-4 px-1">
            ResourceFlow CRUD
          </p>

          <ul className="space-y-1" role="list">
            {resourceNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span
                          className={`text-xs mt-0.5 block truncate transition-colors ${
                            isActive
                              ? 'text-primary-500 dark:text-primary-400 opacity-80'
                              : 'text-surface-400 dark:text-surface-500'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100 text-primary-400' : 'opacity-0 group-hover:opacity-50'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Footer note */}
          <div className="mt-8 p-3 bg-surface-50 dark:bg-surface-800/60 rounded-lg border border-surface-100 dark:border-surface-700/50">
            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              Built with{' '}
              <span className="font-medium text-surface-700 dark:text-surface-300">
                React Hook Form
              </span>{' '}
              +{' '}
              <span className="font-medium text-surface-700 dark:text-surface-300">Zod</span>{' '}
              + Tailwind CSS v4
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;