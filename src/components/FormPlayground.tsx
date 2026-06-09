import { useState } from 'react';
import { Check, Copy, Code2, Eye, FileJson } from 'lucide-react';

interface FormPlaygroundProps {
  title: string;
  description: string;
  filename: string;
  code: string;
  schemaFilename: string;
  schema: string;
  children: React.ReactNode;
}

export function FormPlayground({
  title,
  description,
  filename,
  code,
  schemaFilename,
  schema,
  children,
}: FormPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'schema'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = activeTab === 'code' ? code : schema;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-200 dark:border-surface-800/80">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
            {title}
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm leading-normal">
            {description}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-surface-100 dark:bg-surface-800/80 p-1 rounded-lg border border-surface-200/50 dark:border-surface-700/30 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
            }`}
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
            }`}
          >
            <Code2 size={14} />
            React Code
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
            }`}
          >
            <FileJson size={14} />
            Zod Schema
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6 flex-1 min-h-0">
        {activeTab === 'preview' && (
          <div className="form-card p-6 sm:p-8 animate-fade-in">
            {children}
          </div>
        )}

        {(activeTab === 'code' || activeTab === 'schema') && (
          <div className="relative animate-fade-in group rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 overflow-hidden">
            {/* Action Bar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-surface-200 dark:border-surface-800 bg-surface-100/50 dark:bg-surface-900/50">
              <span className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 font-mono uppercase tracking-wider">
                {activeTab === 'code' ? filename : schemaFilename}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-success-600 dark:text-success-400" />
                    <span className="text-success-600 dark:text-success-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Code Content */}
            <pre className="p-5 overflow-auto max-h-[550px] text-xs font-mono leading-relaxed text-surface-800 dark:text-surface-200 scrollbar-thin">
              <code>{activeTab === 'code' ? code : schema}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
