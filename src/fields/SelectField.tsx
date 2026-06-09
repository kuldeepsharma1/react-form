/**
 * SelectField — styled native select with custom chevron.
 *
 * @example
 * <SelectField
 *   name="role"
 *   label="Role"
 *   options={[
 *     { value: 'admin',  label: 'Admin' },
 *     { value: 'editor', label: 'Editor' },
 *   ]}
 *   required
 * />
 */
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { FieldWrapper, buildAriaProps } from './FieldWrapper';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  placeholder = 'Select an option…',
  helperText,
  required,
  disabled,
  className = '',
}: SelectFieldProps<TFieldValues>) {
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
      <select
        id={id}
        disabled={disabled || isSubmitting}
        className={`form-input form-select ${error ? 'form-input-error animate-shake' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        {...register(name)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
