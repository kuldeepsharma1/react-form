import { Search, X } from 'lucide-react';
import type { Resource } from './types';

interface ResourceFiltersProps {
  resource: Resource;
  filters: Record<string, any>;
  onFiltersChange: (newFilters: Record<string, any>) => void;
}

export function ResourceFilters({
  resource,
  filters,
  onFiltersChange,
}: ResourceFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleFilterSelectChange = (fieldName: string, value: string) => {
    onFiltersChange({
      ...filters,
      [fieldName]: value === '' ? undefined : value,
    });
  };

  const clearFilters = () => {
    const cleared: Record<string, any> = { search: '' };
    onFiltersChange(cleared);
  };

  // Identify select and boolean fields to render as selectors
  const filterableFields = resource.fields.filter(
    (f) => f.type === 'select' || f.type === 'boolean'
  );

  const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
    if (key === 'search') return Boolean(val);
    return val !== undefined && val !== '';
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800/80 rounded-xl shadow-xs">
      <div className="flex-1 flex flex-wrap items-center gap-3">
        {/* Global Search Input */}
        <div className="relative min-w-[200px] md:max-w-xs flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={`Search ${resource.pluralName.toLowerCase()}...`}
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="form-input form-input-icon-left text-sm py-1.5"
          />
        </div>

        {/* Dynamic selectors for each filterable field */}
        {filterableFields.map((f) => {
          const val = filters[f.name] ?? '';

          if (f.type === 'select') {
            return (
              <div key={f.name} className="min-w-[120px]">
                <select
                  value={val}
                  onChange={(e) => handleFilterSelectChange(f.name, e.target.value)}
                  className="form-input form-select text-sm py-1.5"
                  aria-label={`Filter by ${f.label}`}
                >
                  <option value="">All {f.label}s</option>
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (f.type === 'boolean') {
            return (
              <div key={f.name} className="min-w-[120px]">
                <select
                  value={val}
                  onChange={(e) => handleFilterSelectChange(f.name, e.target.value)}
                  className="form-input form-select text-sm py-1.5"
                  aria-label={`Filter by ${f.label}`}
                >
                  <option value="">{f.label}: All</option>
                  <option value="true">Yes / True</option>
                  <option value="false">No / False</option>
                </select>
              </div>
            );
          }

          return null;
        })}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
