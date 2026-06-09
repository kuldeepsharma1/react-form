/**
 * ResourceFlow.tsx — Standalone, single-file schema-driven application framework.
 * Copy-paste this file directly into your React project to use all forms, inputs, tables, and validation schemas.
 * 
 * Dependencies:
 *   npm install react-hook-form @hookform/resolvers zod lucide-react
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useForm, Controller, FormProvider as RHFFormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Check,
  X,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================================================
// 1. TYPES & DEFS
// ============================================================================

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'email' | 'select';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldOptions<T = any> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  defaultValue?: T;
  gridSpan?: 'full' | 'half';
}

export interface SelectFieldOptions<T = any> extends FieldOptions<T> {
  options: string[] | SelectOption[];
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  defaultValue: any;
  options?: SelectOption[];
  gridSpan: 'full' | 'half';
}

export interface ResourceConfig {
  name: string;
  pluralName?: string;
  fields: any[];
}

export interface Resource {
  name: string;
  pluralName: string;
  fields: FieldDefinition[];
  schema: z.ZodObject<any>;
  defaultValues: Record<string, any>;
}

// ============================================================================
// 2. RESOURCE DEFINITION COMPILER
// ============================================================================

function toDisplayName(name: string): string {
  const spaced = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function normalizeOptions(options: string[] | SelectOption[]): SelectOption[] {
  return options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });
}

export const field = {
  text(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'text',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  textarea(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'textarea',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'full',
    };
  },

  number(name: string, options?: FieldOptions<number>): FieldDefinition {
    return {
      name,
      type: 'number',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  boolean(name: string, options?: FieldOptions<boolean>): FieldDefinition {
    return {
      name,
      type: 'boolean',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? false,
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  email(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'email',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  select(name: string, options: SelectFieldOptions): FieldDefinition {
    const normalized = normalizeOptions(options.options);
    return {
      name,
      type: 'select',
      label: options.label ?? toDisplayName(name),
      placeholder: options.placeholder ?? 'Select an option...',
      helperText: options.helperText,
      required: options.required !== false,
      options: normalized,
      defaultValue: options.defaultValue ?? (normalized[0]?.value ?? ''),
      gridSpan: options.gridSpan ?? 'half',
    };
  },
};

export function defineResource(config: ResourceConfig): Resource {
  const fields = config.fields as FieldDefinition[];
  const pluralName = config.pluralName ?? `${config.name}s`;

  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  for (const f of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (f.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      case 'email':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        }
        fieldSchema = (fieldSchema as z.ZodString).email('Invalid email address');
        if (!f.required) {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      case 'number':
        fieldSchema = z.preprocess(
          (val) => {
            if (val === '' || val === undefined || val === null) return undefined;
            const num = Number(val);
            return isNaN(num) ? val : num;
          },
          f.required
            ? z.number({ required_error: `${f.label} is required`, invalid_type_error: `${f.label} must be a number` })
            : z.number({ invalid_type_error: `${f.label} must be a number` }).optional()
        );
        break;

      case 'boolean':
        fieldSchema = z.boolean().default(false);
        break;

      case 'select':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      default:
        fieldSchema = z.any();
    }

    schemaShape[f.name] = fieldSchema;
    defaultValues[f.name] = f.defaultValue;
  }

  return {
    name: config.name,
    pluralName,
    fields,
    schema: z.object(schemaShape),
    defaultValues,
  };
}

// ============================================================================
// 3. CORE FORM & CONTEXT ENGINE
// ============================================================================

export interface FormContextValue<TFieldValues extends Record<string, any> = Record<string, any>> {
  form: ReturnType<typeof useForm<TFieldValues>>;
  isSubmitting: boolean;
  isSuccess: boolean;
  setServerErrors: (errors: Record<string, string | string[]>) => void;
}

const FormCtx = createContext<FormContextValue<any> | null>(null);

export function useFormCtx<TFieldValues extends Record<string, any> = Record<string, any>>() {
  const context = useContext(FormCtx);
  if (!context) {
    throw new Error('useFormCtx must be used within a <Form> component');
  }
  return context as FormContextValue<TFieldValues>;
}

export interface FormProps<TFieldValues extends Record<string, any>> {
  schema: z.ZodType<TFieldValues, any, any>;
  onSubmit: (data: TFieldValues) => Promise<void> | void;
  defaultValues?: any;
  className?: string;
  children: React.ReactNode | ((methods: FormContextValue<TFieldValues>) => React.ReactNode);
  onSuccess?: () => void;
}

export function Form<TFieldValues extends Record<string, any>>({
  schema,
  onSubmit,
  defaultValues,
  className = '',
  children,
  onSuccess,
}: FormProps<TFieldValues>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const setServerErrors = useCallback(
    (errors: Record<string, string | string[]>) => {
      Object.entries(errors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        form.setError(field as any, {
          type: 'server',
          message,
        });
      });
    },
    [form]
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await onSubmit(data);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      if (err && typeof err === 'object' && 'errors' in err && typeof err.errors === 'object') {
        setServerErrors(err.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  const contextValue: FormContextValue<TFieldValues> = {
    form,
    isSubmitting,
    isSuccess,
    setServerErrors,
  };

  return (
    <FormCtx.Provider value={contextValue}>
      <RHFFormProvider {...form}>
        <form onSubmit={handleSubmit} noValidate className={className}>
          {typeof children === 'function' ? children(contextValue) : children}
        </form>
      </RHFFormProvider>
    </FormCtx.Provider>
  );
}

// ============================================================================
// 4. STRUCTURE COMPONENTS
// ============================================================================

export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">{title}</h3>
      {description && <p className="form-section-desc">{description}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function FormGrid({ columns = 2, children }: { columns?: number; children: React.ReactNode }) {
  const gridClass = columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4';
  return <div className={gridClass}>{children}</div>;
}

export function FormActions({ align = 'right', children, className = '' }: { align?: 'left' | 'right' | 'between'; children: React.ReactNode; className?: string }) {
  const alignClass =
    align === 'left' ? 'justify-start' : align === 'between' ? 'justify-between' : 'justify-end';
  return <div className={`form-actions ${alignClass} ${className}`}>{children}</div>;
}

// ============================================================================
// 5. INPUT FIELD COMPONENTS
// ============================================================================

export function buildAriaProps(id: string, options: { required?: boolean; error?: string; helperText?: string }) {
  return {
    required: options.required,
    'aria-required': options.required,
    'aria-invalid': options.error ? true : undefined,
    'aria-describedby':
      [options.error ? `${id}-error` : null, options.helperText ? `${id}-helper` : null]
        .filter(Boolean)
        .join(' ') || undefined,
  };
}

export interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({ id, label, required, helperText, error, children, className = '' }: FieldWrapperProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-danger-500 font-semibold ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="form-error-msg">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="form-helper">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function TextField({ name, label, placeholder, helperText, required, disabled, className = '' }: { name: string; label: string; placeholder?: string; helperText?: string; required?: boolean; disabled?: boolean; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} required={required} helperText={helperText} error={error} className={className}>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      />
    </FieldWrapper>
  );
}

export function EmailField({ name, label, placeholder, helperText, required, disabled, className = '' }: { name: string; label: string; placeholder?: string; helperText?: string; required?: boolean; disabled?: boolean; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} required={required} helperText={helperText} error={error} className={className}>
      <input
        id={id}
        type="email"
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      />
    </FieldWrapper>
  );
}

export function PasswordField({ name, label, placeholder, helperText, required, disabled, className = '' }: { name: string; label: string; placeholder?: string; helperText?: string; required?: boolean; disabled?: boolean; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} required={required} helperText={helperText} error={error} className={className}>
      <div className="form-input-group">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input form-input-icon-right ${error ? 'form-input-error animate-shake' : ''}`}
          {...buildAriaProps(id, { required, error, helperText })}
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="form-input-suffix-btn cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </FieldWrapper>
  );
}

export function TextAreaField({ name, label, placeholder, helperText, required, disabled, rows = 3, className = '' }: { name: string; label: string; placeholder?: string; helperText?: string; required?: boolean; disabled?: boolean; rows?: number; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} required={required} helperText={helperText} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input form-textarea ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      />
    </FieldWrapper>
  );
}

export function SelectField({ name, label, options, placeholder, helperText, required, disabled, className = '' }: { name: string; label: string; options: SelectOption[]; placeholder?: string; helperText?: string; required?: boolean; disabled?: boolean; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper id={id} label={label} required={required} helperText={helperText} error={error} className={className}>
      <select
        id={id}
        disabled={disabled}
        className={`form-input form-select ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function CheckboxField({ name, label, description, required, disabled, className = '' }: { name: string; label: string; description?: string; required?: boolean; disabled?: boolean; className?: string }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <div className={`flex items-start gap-3 py-1.5 ${className}`}>
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        className="form-checkbox"
        {...buildAriaProps(id, { required, error })}
        {...register(name)}
      />
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer select-none">
          {label}
        </label>
        {description && <p className="form-helper mt-0.5">{description}</p>}
        {error && (
          <p id={`${id}-error`} className="form-error-msg flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function SwitchField({ name, label, description, disabled, className = '' }: { name: string; label: string; description?: string; disabled?: boolean; className?: string }) {
  const { control } = useFormContext();
  const id = `field-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const checked = Boolean(value);
        return (
          <div className={`flex items-center justify-between gap-4 py-3 ${className}`}>
            <div className="flex-1">
              <label htmlFor={id} className="text-sm font-medium text-surface-800 dark:text-surface-200 cursor-pointer">
                {label}
              </label>
              {description && <p className="form-helper mt-0.5">{description}</p>}
            </div>
            <button
              id={id}
              type="button"
              role="switch"
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onChange(!checked)}
              className={`form-switch-track ${checked ? 'checked' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus-visible:ring-2 focus-visible:ring-primary-500`}
            >
              <span className="form-switch-thumb" />
            </button>
          </div>
        );
      }}
    />
  );
}

// ============================================================================
// 6. GENERATED COMPONENTS
// ============================================================================

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
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

              {errorMsg && (
                <span className="form-error-msg">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </span>
              )}

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
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleFilterSelectChange = (fieldName: string, value: string) => {
    onFiltersChange({ ...filters, [fieldName]: value === '' ? undefined : value });
  };

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

        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange({ search: '' })}
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

function getBadgeColor(value: string): string {
  const val = String(value).toLowerCase();
  if (val === 'admin') return 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-800/30';
  if (val === 'manager') return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/40 dark:border-indigo-800/30';
  if (val === 'user') return 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

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

function formatValue(value: any, fieldName: string, type: string): React.ReactNode {
  if (value === undefined || value === null || value === '') return <span className="text-surface-400 dark:text-surface-600">—</span>;

  if (type === 'boolean') {
    return Boolean(value) ? (
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
    return <span className="text-surface-600 dark:text-surface-300 font-mono text-xs">{value}</span>;
  }

  return <span className="text-surface-800 dark:text-surface-200 font-medium">{String(value)}</span>;
}

interface ResourceTableProps {
  resource: Resource;
  data: any[];
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  filters: Record<string, any>;
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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = resource.fields.some((f) => {
          if (f.type === 'boolean') return false;
          const val = item[f.name];
          return val !== undefined && String(val).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      for (const f of resource.fields) {
        const activeFilter = filters[f.name];
        if (activeFilter !== undefined && activeFilter !== '') {
          const val = item[f.name];
          if (f.type === 'boolean') {
            if (Boolean(val) !== (activeFilter === 'true')) return false;
          } else {
            if (String(val) !== String(activeFilter)) return false;
          }
        }
      }
      return true;
    });
  }, [data, filters, resource.fields]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    const fieldDef = resource.fields.find((f) => f.name === sortField);
    const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (fieldDef?.type === 'number') {
        return (Number(valA) - Number(valB)) * directionMultiplier;
      }
      if (fieldDef?.type === 'boolean') {
        return ((valA ? 1 : 0) - (valB ? 1 : 0)) * directionMultiplier;
      }
      return String(valA).localeCompare(String(valB)) * directionMultiplier;
    });
  }, [filteredData, sortField, sortDirection, resource.fields]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? sortedData.map((d) => d.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));
  };

  const isAllSelected = sortedData.length > 0 && selectedIds.length === sortedData.length;

  return (
    <div className="relative">
      <div className="form-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/40 border-b border-surface-200 dark:border-surface-800/80">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    disabled={loading || sortedData.length === 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="form-checkbox cursor-pointer rounded"
                  />
                </th>
                {resource.fields.map((f) => (
                  <th key={f.name} className="px-6 py-4 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider select-none">
                    <button onClick={() => handleSort(f.name)} className="flex items-center gap-1 hover:text-surface-900 dark:hover:text-surface-100 transition-colors font-semibold uppercase cursor-pointer">
                      {f.label}
                      {sortField === f.name ? (
                        sortDirection === 'asc' ? <ChevronUp size={14} className="text-primary-600" /> : <ChevronDown size={14} className="text-primary-600" />
                      ) : (
                        <ChevronDown size={14} className="opacity-0 hover:opacity-50 text-surface-400 transition-opacity" />
                      )}
                    </button>
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800/80">
              {loading ? (
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
                <tr>
                  <td colSpan={resource.fields.length + 2} className="px-6 py-12 text-center">
                    <AlertCircle className="text-surface-300 dark:text-surface-700 mb-3 mx-auto" size={36} />
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-200">No records found</h3>
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className={`hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-colors ${isSelected ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''}`}>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="form-checkbox cursor-pointer rounded"
                        />
                      </td>
                      {resource.fields.map((f) => (
                        <td key={f.name} className="px-6 py-4 text-sm">
                          {formatValue(item[f.name], f.name, f.type)}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button onClick={() => onEdit(item)} className="p-1 rounded text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer">
                              <Edit3 size={15} />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => { if (window.confirm('Are you sure?')) onDelete(item.id); }} className="p-1 rounded text-surface-500 hover:text-danger-600 dark:text-surface-400 dark:hover:text-danger-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-pointer">
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
            onClick={() => {
              if (window.confirm(`Delete ${selectedIds.length} selected items?`)) {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-danger-600 text-white hover:bg-danger-700 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <button onClick={() => setSelectedIds([])} className="text-xs font-medium text-surface-400 hover:text-surface-200 dark:text-surface-500 dark:hover:text-surface-700 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
