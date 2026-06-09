/**
 * PasswordField — password input with show/hide toggle and strength meter.
 *
 * Pass `showStrengthMeter` to enable a visual password strength indicator.
 *
 * @example
 * <PasswordField name="password" label="Password" showStrengthMeter required />
 */
import { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useFormCtx } from '../form/FormContext';
import { FieldWrapper, buildAriaProps } from './FieldWrapper';

// ── Strength calculation ───────────────────────────────────────────────────
type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function getStrength(password: string): StrengthLevel {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z\d]/.test(password)) score++;
  return Math.min(4, score) as StrengthLevel;
}

const strengthConfig: Record<StrengthLevel, { label: string; color: string; width: string }> = {
  0: { label: '',         color: 'bg-surface-200',  width: '0%'   },
  1: { label: 'Weak',     color: 'bg-danger-500',   width: '25%'  },
  2: { label: 'Fair',     color: 'bg-warning-500',  width: '50%'  },
  3: { label: 'Good',     color: 'bg-primary-400',  width: '75%'  },
  4: { label: 'Strong',   color: 'bg-success-500',  width: '100%' },
};

// ── Component ──────────────────────────────────────────────────────────────
export interface PasswordFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  showStrengthMeter?: boolean;
  autoComplete?: 'current-password' | 'new-password';
  className?: string;
}

export function PasswordField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label = 'Password',
  placeholder = '••••••••',
  helperText,
  required,
  disabled,
  showStrengthMeter = false,
  autoComplete = 'current-password',
  className = '',
}: PasswordFieldProps<TFieldValues>) {
  const { form, isSubmitting } = useFormCtx<TFieldValues>();
  const { register, watch, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  const id = `field-${name}`;

  const [visible, setVisible] = useState(false);
  const passwordValue = watch(name) as string || '';
  const strength = showStrengthMeter ? getStrength(passwordValue) : 0;
  const strengthInfo = strengthConfig[strength];

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
          <Lock size={16} />
        </span>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled || isSubmitting}
          className={`form-input form-input-icon-left form-input-icon-right ${error ? 'form-input-error animate-shake' : ''}`}
          {...buildAriaProps(id, { required, error, helperText })}
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="form-input-suffix-btn"
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength meter */}
      {showStrengthMeter && passwordValue.length > 0 && (
        <div className="mt-2" aria-label={`Password strength: ${strengthInfo.label}`}>
          <div className="flex gap-1 mb-1">
            {([1, 2, 3, 4] as const).map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  strength >= level ? strengthInfo.color : 'bg-surface-200 dark:bg-surface-700'
                }`}
              />
            ))}
          </div>
          {strengthInfo.label && (
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Strength:{' '}
              <span className="font-medium text-surface-700 dark:text-surface-300">
                {strengthInfo.label}
              </span>
            </p>
          )}
        </div>
      )}
    </FieldWrapper>
  );
}
