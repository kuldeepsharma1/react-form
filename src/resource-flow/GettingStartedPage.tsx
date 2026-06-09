import { useState } from 'react';
import { BookOpen, Check, Copy, Code2, Cpu, Sparkles, Terminal, ChevronDown } from 'lucide-react';

// @ts-ignore - Vite raw text loader to import the entire framework as a copyable string
import frameworkCode from './ResourceFlow?raw';

export function GettingStartedPage() {
  const [copiedFramework, setCopiedFramework] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);

  const handleCopyFramework = async () => {
    await navigator.clipboard.writeText(frameworkCode);
    setCopiedFramework(true);
    setTimeout(() => setCopiedFramework(false), 2000);
  };

  const handleCopyCSS = async () => {
    const cssVariables = `/* Custom Variable Theme overrides. Add this to your global index.css: */
:root {
  --color-primary-50:  #f8f9fc;
  --color-primary-100: #eef2f6;
  --color-primary-500: #635bff;
  --color-primary-600: #564dcf;
  --color-primary-700: #483ea8;
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}`;
    await navigator.clipboard.writeText(cssVariables);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="pb-6 border-b border-surface-200 dark:border-surface-850">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-primary-500" size={24} />
          <span className="text-xs uppercase font-bold tracking-widest text-primary-600 dark:text-primary-400">
            Installation Guide
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
          Get Started with ResourceFlow
        </h1>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-2xl">
          ResourceFlow is a schema-driven application framework. Define your models once and automatically generate forms, zod validators, sorting tables, search inputs, and filters with absolute type-safety.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-500">
            <Sparkles size={16} />
          </div>
          <h3 className="text-sm font-bold text-surface-900 dark:text-surface-50">Single Source of Truth</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-normal">
            No duplicated validation logic. Everything (TypeScript types, validations, forms, tables) derives from the schema definition.
          </p>
        </div>

        <div className="form-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-500">
            <Cpu size={16} />
          </div>
          <h3 className="text-sm font-bold text-surface-900 dark:text-surface-50">Zero boilerplate CRUD</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-normal">
            Generate full tables, complex search query filters, inputs, and slide-overs in a single line of React code.
          </p>
        </div>

        <div className="form-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-500">
            <Code2 size={16} />
          </div>
          <h3 className="text-sm font-bold text-surface-900 dark:text-surface-50">Standalone Architecture</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-normal">
            No massive NPM node module lock-ins. Save the single-file core framework directly in your components folder.
          </p>
        </div>
      </div>

      {/* Step by Step Integration */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">Setup Steps</h2>

        {/* Step 1 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-[10px] font-bold">1</span>
            Install Required Dependencies
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 pl-7 leading-relaxed">
            Ensure the base validation, form handlers, and icon packages are installed in your React project:
          </p>
          <div className="pl-7">
            <div className="relative group rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 overflow-hidden max-w-xl">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-surface-200 dark:border-surface-850 bg-surface-100/50 dark:bg-surface-900/50">
                <span className="text-[10px] font-semibold text-surface-400 dark:text-surface-500 font-mono flex items-center gap-1">
                  <Terminal size={11} /> Bash / Shell
                </span>
              </div>
              <pre className="p-3.5 text-xs font-mono text-surface-800 dark:text-surface-200 overflow-x-auto">
                <code>npm install react-hook-form @hookform/resolvers zod lucide-react</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-[10px] font-bold">2</span>
            Create Standalone Core File
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 pl-7 leading-relaxed">
            Create a file named <code className="font-mono bg-surface-100 dark:bg-surface-800 px-1 py-0.5 rounded text-primary-600 dark:text-primary-400">ResourceFlow.tsx</code> in your components folder and copy-paste the entire framework core below. This enables zero relative import path errors when saving generated layouts:
          </p>
          <div className="pl-7 space-y-2">
            <button
              onClick={handleCopyFramework}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              {copiedFramework ? (
                <>
                  <Check size={13} />
                  Copied Standalone Core!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy ResourceFlow.tsx Core Source Code
                </>
              )}
            </button>

            <details className="group border border-surface-200 dark:border-surface-800 rounded-lg overflow-hidden bg-surface-50 dark:bg-surface-950">
              <summary className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-100/50 dark:hover:bg-surface-900/50 cursor-pointer select-none">
                <span>View Full ResourceFlow.tsx Code (1000 lines)</span>
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-surface-250 dark:border-surface-850 p-4 font-mono text-[10px] leading-relaxed max-h-96 overflow-y-auto scrollbar-thin text-surface-800 dark:text-surface-200">
                <pre>
                  <code>{frameworkCode}</code>
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-[10px] font-bold">3</span>
            Copy CSS Variables
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 pl-7 leading-relaxed">
            Ensure your global CSS file contains the appropriate Tailwind custom property colors and border-radius tokens:
          </p>
          <div className="pl-7 space-y-2">
            <button
              onClick={handleCopyCSS}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              {copiedCSS ? (
                <>
                  <Check size={13} />
                  Copied CSS variables!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy CSS Variable Styles
                </>
              )}
            </button>
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 p-4 font-mono text-xs text-surface-800 dark:text-surface-200 max-w-xl">
              <pre>{`:root {
  --color-primary-50:  #f8f9fc;
  --color-primary-100: #eef2f6;
  --color-primary-500: #635bff;
  --color-primary-600: #564dcf;
  --color-primary-700: #483ea8;
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Done Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-start gap-3">
        <Check className="text-emerald-600 dark:text-emerald-450 mt-0.5 flex-shrink-0" size={16} />
        <div>
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Ready to go!</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 leading-relaxed">
            You are fully set up. Click on any of the generated items in the sidebar under <strong>ResourceFlow CRUD</strong> to view the interactive tables, search engines, filters, slide drawer CRUD forms, and dynamic code compilers.
          </p>
        </div>
      </div>
    </div>
  );
}
