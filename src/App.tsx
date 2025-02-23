import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import BasicForm from './components/BasicForm'; // Assuming this is already styled professionally

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main
          className={`flex-1 transition-all duration-300 pt-16 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">
                Form Templates
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Choose from our collection of professionally designed form templates to accelerate your development workflow.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
              <div className="p-6">
                <BasicForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;