/**
 * Form — the primary consumer-facing wrapper component.
 *
 * Automatically:
 *   - Configures React Hook Form with a Zod resolver
 *   - Provides FormContext to all child fields
 *   - Manages submission loading / success / error states
 *   - Maps server errors back onto individual fields
 *
 * @example
 * <Form schema={loginSchema} onSubmit={handleLogin} defaultValues={...}>
 *   <EmailField name="email" label="Email" />
 *   <PasswordField name="password" label="Password" />
 *   <FormActions><button type="submit">Sign In</button></FormActions>
 * </Form>
 */
import { useCallback, useState, type ReactNode } from 'react';
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { FormProvider, type FormContextValue } from './FormContext';

// ── Props ──────────────────────────────────────────────────────────────────
export interface FormProps<TFieldValues extends FieldValues> {
  /** Zod schema used for validation */
  schema: ZodType<TFieldValues, any, any>;
  /**
   * Async submission handler.  Receives validated data.
   * May throw or return a server-error payload — errors will be surfaced.
   */
  onSubmit: (data: TFieldValues) => Promise<void> | void;
  /** Pre-fill form values */
  defaultValues?: DefaultValues<TFieldValues>;
  /** Additional class names on the <form> element */
  className?: string;
  /** Children can be standard React nodes or a render function providing form context methods */
  children: ReactNode | ((methods: FormContextValue<TFieldValues>) => ReactNode);
  /** Called after a successful submission */
  onSuccess?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────
export function Form<TFieldValues extends FieldValues>({
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

  /** Map server-side errors (Laravel / generic API) onto RHF fields */
  const setServerErrors = useCallback(
    (errors: Record<string, string | string[]>) => {
      Object.entries(errors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        form.setError(field as Parameters<typeof form.setError>[0], {
          type: 'server',
          message,
        });
      });
    },
    [form],
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await onSubmit(data);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      // Surface server validation errors if thrown as an object
      if (
          err &&
          typeof err === 'object' &&
          'errors' in err &&
          typeof (err as { errors: unknown }).errors === 'object'
      ) {
        setServerErrors(
            (err as { errors: Record<string, string | string[]> }).errors,
        );
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
    <FormProvider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={className}
        aria-label="form"
      >
        {typeof children === 'function' ? children(contextValue) : children}
      </form>
    </FormProvider>
  );
}
