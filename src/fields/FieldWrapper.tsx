/**
 * FieldWrapper — internal shared wrapper used by all field components.
 *
 * Renders: label → input slot → helper text / error message
 * Handles all accessibility attributes automatically.
 */
import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

export interface FieldWrapperProps {
  /** Unique field id (links label → input) */
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  /** RHF error message string */
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FieldWrapper({
  id,
  label,
  required,
  helperText,
  error,
  className = '',
  children,
}: FieldWrapperProps) {
  const helperId = `${id}-helper`;
  const errorId  = `${id}-error`;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className={`form-label ${required ? 'form-label-required' : ''}`}
      >
        {label}
      </label>

      {/* Input slot — children are responsible for passing aria attrs */}
      {children}

      {/* Helper text (only shown when no error) */}
      {helperText && !error && (
        <p id={helperId} className="form-helper">
          {helperText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="form-error-msg animate-slide-down"
        >
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * buildAriaProps — helper that returns the correct aria-describedby,
 * aria-invalid, and aria-required attributes for any input element.
 */
export function buildAriaProps(
  id: string,
  opts: { required?: boolean; error?: string; helperText?: string },
): Record<string, string | boolean | undefined> {
  const describedBy: string[] = [];
  if (opts.helperText && !opts.error) describedBy.push(`${id}-helper`);
  if (opts.error)                      describedBy.push(`${id}-error`);

  return {
    'aria-describedby':  describedBy.length ? describedBy.join(' ') : undefined,
    'aria-invalid':      opts.error ? true : undefined,
    'aria-required':     opts.required ? true : undefined,
  };
}
