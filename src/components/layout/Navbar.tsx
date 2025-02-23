import { useState } from 'react';
import { Sun, Moon, Menu, Plus, MoreVertical } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Navbar = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 fixed w-full z-30 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-400 bg-clip-text text-transparent dark:from-primary-100 ">
              React Forms
            </span>
            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-zinc-700 text-primary-700 dark:text-primary-300 font-medium">
              Beta
            </span>
          </div>
        </div>



        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Mobile dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="More options"
            >
              <MoreVertical className="size-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-50 dark:bg-zinc-800 shadow-lg rounded-md">
                <ul className="py-1">
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                      Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                      Components
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <button
                      className="cursor-pointer block w-full text-left px-4 py-3 text-sm font-semibold text-white dark:text-gray-100 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-md shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800 "
                    >
                      <Plus className="inline-block mr-2 size-4 text-white dark:text-gray-100 opacity-75" /> {/* Added opacity to icon */}
                      New Form
                    </button>

                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <a
            href="https://github.com/kuldeepsharma1/react-form.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700"
            title="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </a>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-400 hover:from-primary-700 hover:to-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200">
            <Plus className="size-4" />
            New Form
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;