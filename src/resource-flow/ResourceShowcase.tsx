import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { resourcesRegistry, ResourceId } from './definitions';
import { useResourceData } from './useResourceData';
import { ResourceForm, ResourceFilters, ResourceTable } from './ResourceFlow';
import type { Resource } from './ResourceFlow';
import { Plus, RotateCcw, X, Code2, Eye, FileJson, Play, Check, BookOpen, FileCode } from 'lucide-react';

// @ts-ignore - Vite raw text loader to import the entire framework as a copyable string
import frameworkCode from './ResourceFlow?raw';

// Pre-defined code strings for the Resource definitions to display in code tab
const DEFINITION_CODE_STRINGS: Record<string, string> = {
  User: `import { defineResource, field } from './ResourceFlow';

export const User = defineResource({
  name: "User",
  pluralName: "Users",
  fields: [
    field.text("name", { 
      label: "Full Name", 
      placeholder: "Jane Doe",
      helperText: "First and last name"
    }),
    field.email("email", { 
      label: "Email Address", 
      placeholder: "jane@example.com" 
    }),
    field.select("role", {
      label: "System Role",
      options: ["Admin", "Manager", "User"],
      defaultValue: "User"
    }),
    field.boolean("active", { 
      label: "Active Status", 
      defaultValue: true 
    })
  ]
});`,
  Product: `import { defineResource, field } from './ResourceFlow';

export const Product = defineResource({
  name: "Product",
  pluralName: "Products",
  fields: [
    field.text("title", { 
      label: "Product Title", 
      placeholder: "Wireless Headphones" 
    }),
    field.textarea("description", { 
      label: "Product Description", 
      placeholder: "High fidelity audio, 40h battery, active noise cancelling..." 
    }),
    field.number("price", { 
      label: "Price (USD)", 
      placeholder: "199.99" 
    }),
    field.boolean("active", { 
      label: "Active / Listed", 
      defaultValue: true 
    })
  ]
});`,
  Order: `import { defineResource, field } from './ResourceFlow';

export const Order = defineResource({
  name: "Order",
  pluralName: "Orders",
  fields: [
    field.text("orderNumber", { 
      label: "Order Number", 
      placeholder: "ORD-9848-X" 
    }),
    field.email("customerEmail", { 
      label: "Customer Email", 
      placeholder: "customer@domain.com" 
    }),
    field.select("status", {
      label: "Order Status",
      options: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      defaultValue: "Pending"
    }),
    field.number("total", { 
      label: "Total Amount ($)", 
      placeholder: "0.00" 
    }),
    field.boolean("paid", { 
      label: "Payment Completed", 
      defaultValue: false 
    })
  ]
});`,
  Customer: `import { defineResource, field } from './ResourceFlow';

export const Customer = defineResource({
  name: "Customer",
  pluralName: "Customers",
  fields: [
    field.text("name", { 
      label: "Customer Name", 
      placeholder: "Acme Corp" 
    }),
    field.email("email", { 
      label: "Billing Email", 
      placeholder: "finance@acme.com" 
    }),
    field.text("company", { 
      label: "Company Name", 
      placeholder: "Acme Inc." 
    }),
    field.select("status", {
      label: "Customer Status",
      options: ["Active", "Inactive", "Lead"],
      defaultValue: "Lead"
    }),
    field.number("ltv", { 
      label: "Lifetime Value (USD)", 
      placeholder: "2500.00", 
      defaultValue: 0 
    })
  ]
});`,
  Team: `import { defineResource, field } from './ResourceFlow';

export const Team = defineResource({
  name: "Team",
  pluralName: "Teams",
  fields: [
    field.text("name", { 
      label: "Team Name", 
      placeholder: "Growth Marketing" 
    }),
    field.textarea("description", { 
      label: "Team Description", 
      placeholder: "Focused on developer adoption, tutorials, and partner ecosystem..." 
    }),
    field.select("plan", {
      label: "Subscription Plan",
      options: ["Free", "Growth", "Enterprise"],
      defaultValue: "Free"
    }),
    field.boolean("active", { 
      label: "Status Active", 
      defaultValue: true 
    })
  ]
});`,
  Project: `import { defineResource, field } from './ResourceFlow';

export const Project = defineResource({
  name: "Project",
  pluralName: "Projects",
  fields: [
    field.text("name", { 
      label: "Project Name", 
      placeholder: "Website Replatforming" 
    }),
    field.textarea("description", { 
      label: "Project Scope", 
      placeholder: "Migrate legacy marketing site to Next.js and Tailwind v4..." 
    }),
    field.select("priority", {
      label: "Priority Level",
      options: ["Low", "Medium", "High"],
      defaultValue: "Medium"
    }),
    field.number("budget", { 
      label: "Project Budget (USD)", 
      placeholder: "15000" 
    }),
    field.boolean("completed", { 
      label: "Mark Completed", 
      defaultValue: false 
    })
  ]
});`,
};

// Prints Zod Schema dynamically
function printZodSchema(resource: Resource): string {
  const lines = [`import { z } from 'zod';`, ``, `export const ${resource.name}Schema = z.object({`];
  for (const f of resource.fields) {
    let zodStr = '';
    if (f.type === 'text' || f.type === 'textarea') {
      zodStr = f.required
        ? `z.string().min(1, "${f.label} is required")`
        : `z.string().optional().or(z.literal(''))`;
    } else if (f.type === 'email') {
      zodStr = f.required
        ? `z.string().min(1, "${f.label} is required").email("Invalid email address")`
        : `z.string().email("Invalid email address").optional().or(z.literal(''))`;
    } else if (f.type === 'number') {
      zodStr = `z.preprocess(
    (val) => val === '' || val === undefined || val === null ? undefined : Number(val),
    ${f.required ? `z.number({ required_error: "${f.label} is required" })` : `z.number().optional()`}
  )`;
    } else if (f.type === 'boolean') {
      zodStr = `z.boolean().default(false)`;
    } else if (f.type === 'select') {
      zodStr = f.required
        ? `z.string().min(1, "${f.label} is required")`
        : `z.string().optional().or(z.literal(''))`;
    }
    lines.push(`  ${f.name}: ${zodStr},`);
  }
  lines.push('});');
  return lines.join('\n');
}

// Inferred TypeScript Types printer
function printTypeScriptType(resource: Resource): string {
  const lines = [
    `import { z } from 'zod';`,
    `import { ${resource.name}Schema } from './schemas';`,
    ``,
    `export type ${resource.name} = z.infer<typeof ${resource.name}Schema>;`,
    ``,
    `/* Inferred structure resolves to: */`,
    `export interface ${resource.name} {`,
  ];

  for (const f of resource.fields) {
    let tsType = 'string';
    if (f.type === 'number') tsType = 'number';
    else if (f.type === 'boolean') tsType = 'boolean';
    else if (f.type === 'select' && f.options) {
      tsType = f.options.map((o) => `'${o.value}'`).join(' | ');
    }

    lines.push(`  ${f.name}${f.required ? '' : '?'}: ${tsType};`);
  }

  lines.push('}');
  return lines.join('\n');
}

export function ResourceShowcase() {
  const { resourceId } = useParams<{ resourceId: string }>();

  // Ensure routing points to a valid configured resource, default to users
  const activeResourceId = (resourceId && resourceId in resourcesRegistry ? resourceId : 'users') as ResourceId;
  const resource = resourcesRegistry[activeResourceId];

  // Load state and local CRUD hook
  const {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    bulkDelete,
    resetToSeeds,
  } = useResourceData(resource);

  // Active Main Tab: 'interactive' | 'schema'
  const [activeMainTab, setActiveMainTab] = useState<'interactive' | 'schema'>('interactive');
  
  // Developer Console Code Sub-tab: 'guide' | 'framework' | 'def' | 'zod' | 'ts' | 'css'
  const [codeSubTab, setCodeSubTab] = useState<'guide' | 'framework' | 'def' | 'zod' | 'ts' | 'css'>('guide');

  // Filters State
  const [filters, setFilters] = useState<Record<string, any>>({ search: '' });

  // Form Drawer slide-over State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Clipboard Copied indicator
  const [copied, setCopied] = useState(false);

  // Theme configuration states
  const [themeColor, setThemeColor] = useState<string>('stripe-indigo');
  const [roundedness, setRoundedness] = useState<string>('default');
  const [themeConfigOpen, setThemeConfigOpen] = useState(false);

  // Reset drawer state when resource ID shifts
  useEffect(() => {
    setDrawerOpen(false);
    setEditingItem(null);
    setFilters({ search: '' });
  }, [activeResourceId]);

  const handleCreateClick = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
    } else {
      createItem(data);
    }
    setDrawerOpen(false);
    setEditingItem(null);
  };

  // Compile CSS custom properties based on theme selection
  const themeStyles = useMemo(() => {
    const styles: Record<string, string> = {};

    switch (themeColor) {
      case 'apple-blue':
        styles['--color-primary-50'] = '#f5f9ff';
        styles['--color-primary-100'] = '#e0f0ff';
        styles['--color-primary-500'] = '#0071e3';
        styles['--color-primary-600'] = '#0066cc';
        styles['--color-primary-700'] = '#0055aa';
        break;
      case 'google-green':
        styles['--color-primary-50'] = '#e8f7ed';
        styles['--color-primary-100'] = '#d0f0db';
        styles['--color-primary-500'] = '#1ea24a';
        styles['--color-primary-600'] = '#1aa34a';
        styles['--color-primary-700'] = '#167f39';
        break;
      case 'linear-violet':
        styles['--color-primary-50'] = '#faf5ff';
        styles['--color-primary-100'] = '#f3e8ff';
        styles['--color-primary-500'] = '#5e6ad2';
        styles['--color-primary-600'] = '#4f5ac2';
        styles['--color-primary-700'] = '#3f4ab2';
        break;
      case 'coral-orange':
        styles['--color-primary-50'] = '#fff6f5';
        styles['--color-primary-100'] = '#ffeae6';
        styles['--color-primary-500'] = '#ff4f38';
        styles['--color-primary-600'] = '#e53e28';
        styles['--color-primary-700'] = '#cc2d18';
        break;
      case 'graphite-dark':
        styles['--color-primary-50'] = '#f3f4f6';
        styles['--color-primary-100'] = '#e5e7eb';
        styles['--color-primary-500'] = '#1c1c1e';
        styles['--color-primary-600'] = '#121212';
        styles['--color-primary-700'] = '#000000';
        break;
      case 'stripe-indigo':
      default:
        styles['--color-primary-50'] = '#f8f9fc';
        styles['--color-primary-100'] = '#eef2f6';
        styles['--color-primary-500'] = '#635bff';
        styles['--color-primary-600'] = '#564dcf';
        styles['--color-primary-700'] = '#483ea8';
        break;
    }

    switch (roundedness) {
      case 'sharp':
        styles['--radius-sm'] = '0px';
        styles['--radius-md'] = '0px';
        styles['--radius-lg'] = '0px';
        styles['--radius-xl'] = '0px';
        styles['--radius-full'] = '0px';
        break;
      case 'pill':
        styles['--radius-sm'] = '6px';
        styles['--radius-md'] = '14px';
        styles['--radius-lg'] = '24px';
        styles['--radius-xl'] = '32px';
        styles['--radius-full'] = '9999px';
        break;
      case 'default':
      default:
        styles['--radius-sm'] = '0.375rem';
        styles['--radius-md'] = '0.5rem';
        styles['--radius-lg'] = '0.75rem';
        styles['--radius-xl'] = '1rem';
        styles['--radius-full'] = '9999px';
        break;
    }

    return styles as React.CSSProperties & Record<string, string>;
  }, [themeColor, roundedness]);

  const cssThemeString = useMemo(() => {
    return `/* Forms Theme Style overrides. Add this to index.css or :root wrapper: */
:root {
  --color-primary-50:  ${themeStyles['--color-primary-50'] as string};
  --color-primary-100: ${themeStyles['--color-primary-100'] as string};
  --color-primary-500: ${themeStyles['--color-primary-500'] as string};
  --color-primary-600: ${themeStyles['--color-primary-600'] as string};
  --color-primary-700: ${themeStyles['--color-primary-700'] as string};
  
  --radius-sm: ${themeStyles['--radius-sm'] as string};
  --radius-md: ${themeStyles['--radius-md'] as string};
  --radius-lg: ${themeStyles['--radius-lg'] as string};
  --radius-xl: ${themeStyles['--radius-xl'] as string};
}`;
  }, [themeStyles]);

  const gettingStartedGuide = useMemo(() => {
    return `# Getting Started with ResourceFlow Framework

Follow these 3 simple steps to integrate this schema-driven form and CRUD framework into your own React application:

### Step 1: Install Dependencies
Ensure you have the required packages installed in your project:
  npm install react-hook-form @hookform/resolvers zod lucide-react

### Step 2: Add the Core Standalone Framework
Create a file named "ResourceFlow.tsx" in your project's component directory and copy-paste the entire code from the "ResourceFlow.tsx (Framework)" tab.

### Step 3: Add CSS Custom Theme Properties
Add these variables to your global stylesheet (e.g. index.css) to apply the active brand colors and corner shapes:

${cssThemeString}

---

## How to Define and Render Resources

Once set up, define a resource and let the framework generate forms, validation schemas, and tables automatically:

\`\`\`tsx
import { defineResource, field, ResourceForm, ResourceTable } from './ResourceFlow';

// 1. Define Resource Schema
const Product = defineResource({
  name: "Product",
  fields: [
    field.text("title", { label: "Product Name" }),
    field.textarea("description", { label: "Scope Detail" }),
    field.number("price", { label: "USD Price" }),
    field.boolean("active", { label: "Listed Active" })
  ]
});

// 2. Render Auto-Generated Form
<ResourceForm 
  resource={Product} 
  onSubmit={(data) => api.saveProduct(data)} 
/>

// 3. Render Auto-Generated Sorted Table
<ResourceTable 
  resource={Product} 
  data={productsList} 
  filters={filters} 
/>
\`\`\`
`;
  }, [cssThemeString]);

  const activeCodeString = useMemo(() => {
    if (codeSubTab === 'guide') return gettingStartedGuide;
    if (codeSubTab === 'framework') return frameworkCode || '';
    if (codeSubTab === 'def') return DEFINITION_CODE_STRINGS[resource.name] || '';
    if (codeSubTab === 'zod') return printZodSchema(resource);
    if (codeSubTab === 'ts') return printTypeScriptType(resource);
    return cssThemeString;
  }, [resource, codeSubTab, cssThemeString, gettingStartedGuide]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(activeCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={themeStyles} className="space-y-6 animate-fade-in relative min-h-[600px]">
      {/* Drawer Overlay Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Panel (Slide-over) */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-800/80">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-50">
                {editingItem ? `Edit ${resource.name}` : `Create New ${resource.name}`}
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                ResourceFlow auto-generated input form schema.
              </p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <ResourceForm
              key={`${resource.name}-${editingItem?.id || 'new'}`}
              resource={resource}
              defaultValues={editingItem || undefined}
              onSubmit={handleFormSubmit}
              submitLabel={editingItem ? 'Update Record' : `Add ${resource.name}`}
            />
          </div>
        </div>
      </div>

      {/* Showcase Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800/80">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 tracking-tight flex items-center gap-2">
            {resource.pluralName}
            <span className="badge badge-primary text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider">
              ResourceFlow MVP
            </span>
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
            Fully generated validation schemas, filters, CRUD forms, and tables from a single config definition.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetToSeeds}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
            title="Reset storage to original mock seed values"
          >
            <RotateCcw size={14} />
            Reset Data
          </button>
          <button
            onClick={handleCreateClick}
            className="btn btn-primary btn-sm flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
          >
            <Plus size={14} />
            New {resource.name}
          </button>
        </div>
      </div>

      {/* Dynamic Theme Customizer Panel */}
      <div className="form-card border-primary-200/40 dark:border-primary-800/10 bg-primary-50/10 dark:bg-primary-950/5 p-4 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse-dot" />
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-50">
              Form Theme Builder
            </h3>
            <p className="hidden sm:block text-xs text-surface-500 dark:text-surface-400">
              Configure colors, roundedness, and typography variables dynamically.
            </p>
          </div>
          <button
            onClick={() => setThemeConfigOpen(!themeConfigOpen)}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
          >
            {themeConfigOpen ? 'Hide customizer' : 'Customize theme layout...'}
          </button>
        </div>

        {themeConfigOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-surface-200 dark:border-surface-800/80 animate-fade-in">
            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 block uppercase tracking-wider">
                Primary Brand Color
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'apple-blue', color: '#0071e3', label: 'Apple Blue' },
                  { id: 'stripe-indigo', color: '#635bff', label: 'Stripe Indigo' },
                  { id: 'google-green', color: '#1ea24a', label: 'Google Green' },
                  { id: 'linear-violet', color: '#5e6ad2', label: 'Linear Violet' },
                  { id: 'coral-orange', color: '#ff4f38', label: 'Coral Orange' },
                  { id: 'graphite-dark', color: '#2c2c2e', label: 'Graphite Dark' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setThemeColor(c.id)}
                    className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      themeColor === c.id
                        ? 'bg-white dark:bg-surface-850 text-surface-900 dark:text-surface-50 border-primary-500 dark:border-primary-400 shadow-sm ring-2 ring-primary-500/10'
                        : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 bg-transparent text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-500 dark:text-surface-400 block uppercase tracking-wider">
                UI Corner Roundedness
              </label>
              <div className="flex bg-surface-100 dark:bg-surface-800 p-1 rounded-lg border border-surface-200/50 dark:border-surface-800 max-w-xs">
                {[
                  { id: 'sharp', label: 'Sharp' },
                  { id: 'default', label: 'Medium (Default)' },
                  { id: 'pill', label: 'Apple / Pill' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoundedness(r.id)}
                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      roundedness === r.id
                        ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800/80 pb-px">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveMainTab('interactive')}
            className={`pb-2.5 text-sm font-semibold relative transition-colors cursor-pointer ${
              activeMainTab === 'interactive'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Play size={14} />
              Interactive Showcase
            </span>
          </button>
          <button
            onClick={() => setActiveMainTab('schema')}
            className={`pb-2.5 text-sm font-semibold relative transition-colors cursor-pointer ${
              activeMainTab === 'schema'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 size={14} />
              Developer Console (Code)
            </span>
          </button>
        </div>
      </div>

      {/* Showcase Content */}
      <div className="mt-4">
        {activeMainTab === 'interactive' && (
          <div className="space-y-4 animate-fade-in">
            {/* 1. Generated Filters */}
            <ResourceFilters
              resource={resource}
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* 2. Generated Table */}
            <ResourceTable
              resource={resource}
              data={items}
              loading={loading}
              filters={filters}
              onEdit={handleEditClick}
              onDelete={deleteItem}
              onBulkDelete={bulkDelete}
            />
          </div>
        )}

        {activeMainTab === 'schema' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-fade-in">
            {/* Sidebar list of resources for convenience */}
            <div className="lg:col-span-1 form-card p-4 space-y-2">
              <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest block mb-2 px-1">
                Schema Models
              </span>
              {(Object.keys(resourcesRegistry) as ResourceId[]).map((id) => {
                const r = resourcesRegistry[id];
                const isActive = id === activeResourceId;
                return (
                  <Link
                    key={id}
                    to={`/resource/${id}`}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/40 hover:text-surface-900 dark:hover:text-surface-100'
                    }`}
                  >
                    {r.name} Configuration
                  </Link>
                );
              })}
            </div>

            {/* Code Output Screen */}
            <div className="lg:col-span-3 form-card overflow-hidden flex flex-col">
              {/* Output Sub-Tabs */}
              <div className="flex items-center justify-between bg-surface-50 dark:bg-surface-800/40 px-4 py-2 border-b border-surface-200 dark:border-surface-800/80">
                <div className="flex bg-surface-200/50 dark:bg-surface-800 p-0.5 rounded-lg border border-surface-200/20 flex-wrap gap-0.5">
                  <button
                    onClick={() => setCodeSubTab('guide')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'guide'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <BookOpen size={12} />
                    Getting Started
                  </button>
                  <button
                    onClick={() => setCodeSubTab('framework')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'framework'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <FileCode size={12} />
                    ResourceFlow.tsx (Framework)
                  </button>
                  <button
                    onClick={() => setCodeSubTab('def')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'def'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <Eye size={12} />
                    Resource Def
                  </button>
                  <button
                    onClick={() => setCodeSubTab('zod')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'zod'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <FileJson size={12} />
                    Zod Schema
                  </button>
                  <button
                    onClick={() => setCodeSubTab('ts')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'ts'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <Code2 size={12} />
                    TS Type
                  </button>
                  <button
                    onClick={() => setCodeSubTab('css')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                      codeSubTab === 'css'
                        ? 'bg-white dark:bg-surface-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                    }`}
                  >
                    <Code2 size={12} />
                    Theme CSS
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-[11px] font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={11} className="text-success-600 dark:text-success-400" />
                      <span className="text-success-600 dark:text-success-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Code2 size={11} />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Screen content */}
              <div className="p-5 bg-surface-50 dark:bg-surface-950 font-mono text-[11px] leading-relaxed overflow-x-auto scrollbar-thin text-surface-800 dark:text-surface-200 max-h-[550px]">
                <pre className="whitespace-pre-wrap">
                  <code>{activeCodeString}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
