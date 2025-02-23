import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const formCategories = [
    { name: 'Authentication', items: ['Login', 'Registration', 'Password Reset', 'Two Factor Auth'] },
    { name: 'User Input', items: ['Contact Form', 'Profile Form', 'Survey Form', 'Multi-step Form'] },
    { name: 'Business', items: ['Payment Form', 'Booking Form', 'Subscription Form', 'Application Form'] },
    { name: 'Advanced Forms', items: ['Dynamic Form', 'Form with File Upload', 'Validation Examples', 'API Integration'] },
  ];

  return (
    <nav
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 shadow-lg z-20`}
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Form Categories</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label="Close Sidebar"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-8">
          {formCategories.map((category) => (
            <div key={category.name} className="pb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider mb-3 hover:text-primary-600 transition-colors duration-200">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;