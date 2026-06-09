/**
 * CheckboxField — accessible styled checkbox with optional description.
 *
 * @example
 * <CheckboxField
 *   name="terms"
 *   label="I accept the Terms of Service"
 *   description="You must agree before continuing."
 *   required
 * />
 */
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { buildAriaProps } from './FieldWrapper';
import { AlertCircle } from 'lucide-react';

export interface CheckboxFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className = '',
}: CheckboxFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          disabled={disabled || isSubmitting}
          className={`form-checkbox mt-0.5 ${error ? 'outline outline-2 outline-danger-500 rounded' : ''}`}
          aria-describedby={[description ? descId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          {...buildAriaProps(id, { required, error })}
          {...register(name)}
        />
        <div>
          <label
            htmlFor={id}
            className="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
          >
            {label}
            {required && <span className="text-danger-500 ml-1" aria-hidden="true">*</span>}
          </label>
          {description && (
            <p id={descId} className="form-helper mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="form-error-msg animate-slide-down ml-7"
        >
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
