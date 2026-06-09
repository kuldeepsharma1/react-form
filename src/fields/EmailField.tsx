/**
 * EmailField — email input with mail icon and autocomplete hint.
 *
 * @example
 * <EmailField name="email" label="Email Address" required />
 */
import type { FieldValues, Path } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { useFormCtx } from '../form/FormContext';
import { FieldWrapper, buildAriaProps } from './FieldWrapper';

export interface EmailFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function EmailField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label = 'Email address',
  placeholder = 'you@example.com',
  helperText,
  required,
  disabled,
  className = '',
}: EmailFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
      className={className}
    >
      <div className="form-input-group">
        <span className="form-input-prefix-icon" aria-hidden="true">
          <Mail size={16} />
        </span>
        <input
          id={id}
          type="email"
          placeholder={placeholder}
          autoComplete="email"
          inputMode="email"
          disabled={disabled || isSubmitting}
          className={`form-input form-input-icon-left ${error ? 'form-input-error animate-shake' : ''}`}
          {...buildAriaProps(id, { required, error, helperText })}
          {...register(name)}
        />
      </div>
    </FieldWrapper>
  );
}
