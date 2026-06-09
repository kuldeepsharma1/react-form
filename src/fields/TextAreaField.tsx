/**
 * TextAreaField — multi-line text input with optional auto-resize.
 *
 * @example
 * <TextAreaField name="bio" label="Bio" rows={4} maxLength={300} showCount />
 */
import { useRef, useEffect, type MutableRefObject } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useFormCtx } from '../form/FormContext';
import { FieldWrapper, buildAriaProps } from './FieldWrapper';

export interface TextAreaFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  /** Auto-grow height to fit content */
  autoResize?: boolean;
  /** Show character count */
  showCount?: boolean;
  className?: string;
}

export function TextAreaField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  helperText,
  required,
  disabled,
  rows = 3,
  maxLength,
  autoResize = false,
  showCount = false,
  className = '',
}: TextAreaFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const { register, watch, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const value = (watch(name) as string) || '';

  // Auto-resize behaviour
  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoResize]);

  const { ref: registerRef, ...rest } = register(name);

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled || isSubmitting}
        className={`form-input form-textarea ${error ? 'form-input-error animate-shake' : ''} ${autoResize ? 'overflow-hidden' : ''}`}
        {...buildAriaProps(id, { required, error, helperText })}
        ref={(el) => {
          registerRef(el);
          (textareaRef as MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }}
        {...rest}
      />
      {showCount && maxLength && (
        <p className="form-helper text-right" aria-live="polite">
          {value.length}/{maxLength}
        </p>
      )}
    </FieldWrapper>
  );
}
