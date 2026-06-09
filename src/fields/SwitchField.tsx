/**
 * SwitchField — animated toggle switch bound to a boolean form field.
 *
 * @example
 * <SwitchField
 *   name="emailNotifs"
 *   label="Email Notifications"
 *   description="Receive updates about your account via email."
 * />
 */
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { Controller } from 'react-hook-form';

export interface SwitchFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function SwitchField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  disabled,
  className = '',
}: SwitchFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const id = `field-${name}`;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        const checked = Boolean(field.value);
        const isDisabled = disabled || isSubmitting;

        return (
          <div className={`flex items-center justify-between gap-4 py-1 ${className}`}>
            <div className="flex-1">
              <label
                htmlFor={id}
                className="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer"
              >
                {label}
              </label>
              {description && (
                <p className="form-helper mt-0.5">{description}</p>
              )}
            </div>

            {/* Switch track */}
            <button
              id={id}
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={label}
              disabled={isDisabled}
              onClick={() => field.onChange(!checked)}
              className={`form-switch-track ${checked ? 'checked' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2`}
            >
              <span className="form-switch-thumb" />
              <span className="sr-only">{checked ? 'On' : 'Off'}</span>
            </button>
          </div>
        );
      }}
    />
  );
}
