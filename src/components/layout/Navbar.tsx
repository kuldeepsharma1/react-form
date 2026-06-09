import { Sun, Moon, Menu, Github, Layers } from 'lucide-react';
import { useLocation } from 'react-router';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const pageTitles: Record<string, { title: string; description: string }> = {
  '/':         { title: 'Login Form',    description: 'Authentication with server-side error mapping' },
  '/register': { title: 'Register Form', description: 'Registration with password strength meter' },
  '/user':     { title: 'User Profile',  description: 'Enterprise CRUD form with sections & notifications' },
};

const Navbar = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] ?? pageTitles['/'];

  return (
    <header className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/80 dark:border-surface-700/60 fixed w-full z-30 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between max-w-screen-2xl mx-auto gap-4">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Sidebar toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu size={20} />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-sm">
              <Layers size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-base font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              FormKit
            </span>
            <span className="hidden sm:inline-flex badge badge-primary text-[10px]">
              v1.0
            </span>
          </div>

          {/* Breadcrumb divider + page title (md+) */}
          <div className="hidden md:flex items-center gap-2.5 min-w-0">
            <span className="text-surface-300 dark:text-surface-600" aria-hidden="true">/</span>
            <div className="min-w-0">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate block">
                {page.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/kuldeepsharma1/react-form"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="View on GitHub"
          >
            <Github size={18} />
          </a>

          {/* Docs button (desktop) */}
          <a
            href="https://github.com/kuldeepsharma1/react-form"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex btn btn-secondary btn-sm gap-1.5"
          >
            Documentation
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;