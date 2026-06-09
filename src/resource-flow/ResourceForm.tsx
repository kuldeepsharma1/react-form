import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resource } from './types';
import { AlertCircle } from 'lucide-react';

interface ResourceFormProps {
  resource: Resource;
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => void | Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export function ResourceForm({
  resource,
  defaultValues,
  onSubmit,
  submitLabel,
  loading = false,
}: ResourceFormProps) {
  // Combine custom defaults with resource baseline defaults
  const resolvedDefaults = {
    ...resource.defaultValues,
    ...defaultValues,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resource.schema),
    defaultValues: resolvedDefaults,
  });

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-2 gap-4">
        {resource.fields.map((f) => {
          const spanClass = f.gridSpan === 'full' ? 'col-span-2' : 'col-span-2 md:col-span-1';
          const errorMsg = errors[f.name]?.message as string | undefined;

          return (
            <div key={f.name} className={`${spanClass} flex flex-col`}>
              {f.type !== 'boolean' ? (
                <>
                  <label htmlFor={`rf-field-${f.name}`} className="form-label">
                    {f.label}
                    {f.required && <span className="text-danger-500 font-semibold ml-0.5">*</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      id={`rf-field-${f.name}`}
                      placeholder={f.placeholder}
                      disabled={loading}
                      className={`form-input form-textarea ${errorMsg ? 'form-input-error animate-shake' : ''}`}
                      {...register(f.name)}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={`rf-field-${f.name}`}
                      disabled={loading}
                      className={`form-input form-select ${errorMsg ? 'form-input-error animate-shake' : ''}`}
                      {...register(f.name)}
                    >
                      <option value="">{f.placeholder || 'Select option...'}</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`rf-field-${f.name}`}
                      type={f.type === 'number' ? 'text' : f.type}
                      inputMode={f.type === 'number' ? 'decimal' : undefined}
                      placeholder={f.placeholder}
                      disabled={loading}
                      className={`form-input ${errorMsg ? 'form-input-error animate-shake' : ''}`}
                      {...register(f.name)}
                    />
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center">
                  <Controller
                    name={f.name}
                    control={control}
                    render={({ field }) => {
                      const checked = Boolean(field.value);
                      return (
                        <div className="flex items-center justify-between p-3.5 bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-700/80 rounded-lg hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
                          <div>
                            <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                              {f.label}
                            </span>
                            {f.helperText && (
                              <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                                {f.helperText}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={checked}
                            disabled={loading}
                            onClick={() => field.onChange(!checked)}
                            className={`form-switch-track ${checked ? 'checked' : ''} ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            } focus-visible:ring-2 focus-visible:ring-primary-500`}
                          >
                            <span className="form-switch-thumb" />
                          </button>
                        </div>
                      );
                    }}
                  />
                </div>
              )}

              {/* Show error label */}
              {errorMsg && (
                <span className="form-error-msg">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </span>
              )}

              {/* Show helper text only if no error */}
              {f.helperText && !errorMsg && f.type !== 'boolean' && (
                <p className="form-helper">{f.helperText}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800/80">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary min-w-[100px] flex items-center justify-center gap-2"
        >
          {loading && <span className="btn-spinner" />}
          {submitLabel || 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
