import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { LoginForm } from './templates/LoginForm';
import { RegisterForm } from './templates/RegisterForm';
import { UserForm } from './templates/UserForm';
import { ResourceShowcase } from './resource-flow/ResourceShowcase';
import { GettingStartedPage } from './resource-flow/GettingStartedPage';

// ── Page meta descriptions for SEO ─────────────────────────────────────────
const pageMeta: Record<string, { title: string; description: string }> = {
  '/':         {
    title: 'Login Form — FormKit React Form System',
    description: 'Production-ready login form with server-side error mapping, loading states, and accessibility.',
  },
  '/register': {
    title: 'Register Form — FormKit React Form System',
    description: 'Registration form with password strength meter, grid layout, and Zod validation.',
  },
  '/user':     {
    title: 'User Profile — FormKit React Form System',
    description: 'Enterprise CRUD user profile form with sections, notification switches, and unsaved change tracking.',
  },
};

// ── Not-found page ──────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <p className="text-6xl font-extrabold text-surface-200 dark:text-surface-700 mb-4">404</p>
      <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">
        Page not found
      </h2>
      <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
        The form template you're looking for doesn't exist.
      </p>
      <a href="/" className="btn btn-primary btn-sm">Go back home</a>
    </div>
  );
}

// ── Page title updater ──────────────────────────────────────────────────────
function PageMetaUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    let meta = pageMeta[pathname];
    if (!meta && pathname === '/getting-started') {
      meta = {
        title: 'Getting Started — ResourceFlow Framework',
        description: 'Learn how to set up the standalone schema-driven ResourceFlow CRUD and form framework.',
      };
    }
    if (!meta && pathname.startsWith('/resource/')) {
      const model = pathname.split('/').pop() || '';
      const capitalize = model.charAt(0).toUpperCase() + model.slice(1);
      meta = {
        title: `${capitalize} — ResourceFlow Generated CRUD`,
        description: `Auto-generated schema-driven CRUD screen for ${capitalize}.`,
      };
    }
    if (!meta) meta = pageMeta['/'];
    
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', meta.description);
  }, [pathname]);
  return null;
}

// ── Root App ────────────────────────────────────────────────────────────────
const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Respect OS preference on first load
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <PageMetaUpdater />
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main content */}
        <main
          className="flex-1 pt-16 lg:ml-72 min-h-screen transition-all duration-300"
          id="main-content"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Routes>
              <Route path="/"         element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/user"     element={<UserForm />} />
              <Route path="/getting-started" element={<GettingStartedPage />} />
              <Route path="/resource/:resourceId" element={<ResourceShowcase />} />
              <Route path="*"         element={<NotFound />} />
            </Routes>

            {/* System info footer */}
            <p className="text-center text-xs text-surface-400 dark:text-surface-600 mt-6">
              FormKit — React 19 · TypeScript · React Hook Form · Zod · Tailwind CSS v4
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;