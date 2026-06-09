/**
 * TextField — a general-purpose single-line text input.
 *
 * Reads from FormContext automatically — no manual register() calls needed.
 *
 * @example
 * <TextField name="username" label="Username" placeholder="john_doe" required />
 */
import type { HTMLInputTypeAttribute } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { FieldWrapper, buildAriaProps } from './FieldWrapper';

export interface TextFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  type?: Extract<HTMLInputTypeAttribute, 'text' | 'number' | 'tel' | 'url' | 'search'>;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export function TextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  required,
  disabled,
  autoComplete,
  className = '',
}: TextFieldProps<TFieldValues>) {
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
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled || isSubmitting}
        className={`form-input ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      />
    </FieldWrapper>
  );
}
