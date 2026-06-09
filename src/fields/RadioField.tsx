/**
 * RadioField — radio button group rendered as styled option cards.
 *
 * @example
 * <RadioField
 *   name="plan"
 *   label="Billing Plan"
 *   options={[
 *     { value: 'free',  label: 'Free',  description: 'Perfect for side projects' },
 *     { value: 'pro',   label: 'Pro',   description: '$12/month' },
 *   ]}
 *   required
 * />
 */
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { AlertCircle } from 'lucide-react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  options: RadioOption[];
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  /** 'cards' = full-width styled cards, 'list' = compact list */
  variant?: 'cards' | 'list';
  className?: string;
}

export function RadioField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  helperText,
  required,
  disabled,
  variant = 'cards',
  className = '',
}: RadioFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const { register, watch, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  const currentValue = watch(name) as string;
  const groupId = `field-${name}`;
  const errorId = `${groupId}-error`;

  return (
    <fieldset className={`border-0 p-0 m-0 ${className}`} aria-required={required}>
      <legend className={`form-label mb-2 ${required ? 'form-label-required' : ''}`}>
        {label}
      </legend>

      <div
        role="radiogroup"
        aria-describedby={error ? errorId : undefined}
        className={variant === 'cards' ? 'flex flex-col gap-2' : 'flex flex-col gap-1.5'}
      >
        {options.map((opt) => {
          const optId = `${groupId}-${opt.value}`;
          const isSelected = currentValue === opt.value;
          const isDisabled = disabled || isSubmitting || opt.disabled;

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={
                variant === 'cards'
                  ? `radio-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
                  : `flex items-start gap-2.5 py-1 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
              }
            >
              <input
                id={optId}
                type="radio"
                value={opt.value}
                disabled={isDisabled}
                className="form-radio mt-0.5"
                {...register(name)}
              />
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 block">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {helperText && !error && (
        <p className="form-helper mt-2">{helperText}</p>
      )}
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="form-error-msg mt-2 animate-slide-down">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
