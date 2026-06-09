import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit3, Trash2, Check, X, AlertCircle } from 'lucide-react';
import type { Resource } from './types';

interface ResourceTableProps {
  resource: Resource;
  data: any[];
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  filters: Record<string, any>;
}

// Visual premium badge matcher
function getBadgeColor(value: string): string {
  const val = String(value).toLowerCase();

  // Roles
  if (val === 'admin') {
    return 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-800/30';
  }
  if (val === 'manager') {
    return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/40 dark:border-indigo-800/30';
  }
  if (val === 'user') {
    return 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  }

  // Active / Yes / Completed
  if (val === 'active' || val === 'delivered' || val === 'completed' || val === 'enterprise') {
    return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30';
  }
  if (val === 'processing' || val === 'shipped' || val === 'growth') {
    return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/30';
  }
  if (val === 'pending' || val === 'lead' || val === 'medium') {
    return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/40 dark:border-amber-800/30';
  }
  if (val === 'inactive' || val === 'cancelled' || val === 'high') {
    return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/40 dark:border-rose-800/30';
  }

  return 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700';
}

// Currency and float formatter
function formatValue(value: any, fieldName: string, type: string): React.ReactNode {
  if (value === undefined || value === null || value === '') return <span className="text-surface-400 dark:text-surface-600">—</span>;

  if (type === 'boolean') {
    const isTrue = Boolean(value);
    return isTrue ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <Check size={14} strokeWidth={3} /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-surface-400 dark:text-surface-600">
        <X size={14} strokeWidth={3} /> No
      </span>
    );
  }

  if (type === 'number') {
    const num = Number(value);
    if (isNaN(num)) return String(value);

    // Identify financial variables
    const isCurrency = ['price', 'total', 'ltv', 'budget'].includes(fieldName.toLowerCase());
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    }
    return new Intl.NumberFormat('en-US').format(num);
  }

  if (type === 'select') {
    return (
      <span className={`badge text-[11px] font-semibold tracking-wide capitalize ${getBadgeColor(value)}`}>
        {value}
      </span>
    );
  }

  if (type === 'textarea') {
    const str = String(value);
    if (str.length > 50) {
      return (
        <span className="block truncate max-w-xs text-surface-600 dark:text-surface-300" title={str}>
          {str}
        </span>
      );
    }
  }

  if (type === 'email') {
    return (
      <span className="text-surface-600 dark:text-surface-300 font-mono text-xs">
        {value}
      </span>
    );
  }

  return <span className="text-surface-800 dark:text-surface-200 font-medium">{String(value)}</span>;
}

export function ResourceTable({
  resource,
  data,
  loading = false,
  onEdit,
  onDelete,
  onBulkDelete,
  filters,
}: ResourceTableProps) {
  // Sort State
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset selection when resource shifts
  useMemo(() => {
    setSelectedIds([]);
  }, [resource.name]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 1. Apply Search and Select filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Check search filter (across all text-based fields)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = resource.fields.some((f) => {
          if (f.type === 'boolean') return false;
          const val = item[f.name];
          return val !== undefined && String(val).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Check field-specific dropdown filters
      for (const f of resource.fields) {
        const activeFilter = filters[f.name];
        if (activeFilter !== undefined && activeFilter !== '') {
          const val = item[f.name];
          if (f.type === 'boolean') {
            const filterBool = activeFilter === 'true';
            if (Boolean(val) !== filterBool) return false;
          } else {
            if (String(val) !== String(activeFilter)) return false;
          }
        }
      }

      return true;
    });
  }, [data, filters, resource.fields]);

  // 2. Apply Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const fieldDef = resource.fields.find((f) => f.name === sortField);
    const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null/undef
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (fieldDef?.type === 'number') {
        return (Number(valA) - Number(valB)) * directionMultiplier;
      }

      if (fieldDef?.type === 'boolean') {
        const boolA = valA ? 1 : 0;
        const boolB = valB ? 1 : 0;
        return (boolA - boolB) * directionMultiplier;
      }

      // String sorting
      return String(valA).localeCompare(String(valB)) * directionMultiplier;
    });
  }, [filteredData, sortField, sortDirection, resource.fields]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(sortedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected items?`)) {
        onBulkDelete(selectedIds);
        setSelectedIds([]);
      }
    }
  };

  const isAllSelected = sortedData.length > 0 && selectedIds.length === sortedData.length;

  return (
    <div className="relative">
      <div className="form-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse" role="table">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/40 border-b border-surface-200 dark:border-surface-800/80">
                {/* Selection column */}
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    disabled={loading || sortedData.length === 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="form-checkbox cursor-pointer accent-primary-600 rounded"
                    aria-label="Select all rows"
                  />
                </th>

                {/* Dynamic columns */}
                {resource.fields.map((f) => (
                  <th
                    key={f.name}
                    className="px-6 py-4 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider select-none"
                  >
                    <button
                      onClick={() => handleSort(f.name)}
                      className="flex items-center gap-1 hover:text-surface-900 dark:hover:text-surface-100 transition-colors font-semibold uppercase cursor-pointer text-left"
                    >
                      {f.label}
                      {sortField === f.name ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp size={14} className="text-primary-600" />
                        ) : (
                          <ChevronDown size={14} className="text-primary-600" />
                        )
                      ) : (
                        <ChevronDown size={14} className="opacity-0 hover:opacity-50 text-surface-400 transition-opacity" />
                      )}
                    </button>
                  </th>
                ))}

                {/* Actions column */}
                <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-200 dark:divide-surface-800/80">
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 w-4 bg-surface-200 dark:bg-surface-800 rounded mx-auto" />
                    </td>
                    {resource.fields.map((_, cIdx) => (
                      <td key={cIdx} className="px-6 py-4">
                        <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-2/3" />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={resource.fields.length + 2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <AlertCircle className="text-surface-300 dark:text-surface-700 mb-3" size={36} />
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-200">
                        No records found
                      </h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                        Try updating your search query or modifying filters to locate records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Table Rows
                sortedData.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-colors ${
                        isSelected ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''
                      }`}
                    >
                      {/* Selection checkbox */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="form-checkbox cursor-pointer rounded"
                          aria-label={`Select row ${item.id}`}
                        />
                      </td>

                      {/* Dynamic columns values */}
                      {resource.fields.map((f) => (
                        <td key={f.name} className="px-6 py-4 text-sm font-normal">
                          {formatValue(item[f.name], f.name, f.type)}
                        </td>
                      ))}

                      {/* Edit/Delete Actions */}
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1 rounded text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer"
                              aria-label="Edit record"
                            >
                              <Edit3 size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this record?')) {
                                  onDelete(item.id);
                                }
                              }}
                              className="p-1 rounded text-surface-500 hover:text-danger-600 dark:text-surface-400 dark:hover:text-danger-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer"
                              aria-label="Delete record"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Indicator */}
      {selectedIds.length > 0 && onBulkDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-4 animate-slide-up z-50 border border-surface-800 dark:border-surface-200">
          <span className="text-xs font-semibold tracking-wide flex items-center gap-2">
            <span className="bg-primary-600 dark:bg-primary-100 text-white dark:text-primary-700 rounded-full h-5 w-5 inline-flex items-center justify-center text-[10px] font-bold">
              {selectedIds.length}
            </span>
            items selected
          </span>
          <div className="h-4 w-px bg-surface-700 dark:bg-surface-200" />
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-danger-600 text-white hover:bg-danger-700 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs font-medium text-surface-400 hover:text-surface-200 dark:text-surface-500 dark:hover:text-surface-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
