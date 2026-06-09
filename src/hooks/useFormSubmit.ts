/**
 * useFormSubmit — wraps an async submit handler with loading,
 * success, and error state management.
 *
 * @example
 * const { isSubmitting, isSuccess, isError, error, submit } =
 *   useFormSubmit(handleLogin, { successDuration: 2000 });
 */
import { useState, useCallback, useRef } from 'react';

export interface UseFormSubmitOptions {
  /** How long to keep the success state visible (ms). Default: 3000 */
  successDuration?: number;
  /** Called after the success state clears */
  onSettled?: () => void;
}

export interface UseFormSubmitReturn<TData> {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  submit: (data: TData) => Promise<void>;
  reset: () => void;
}

export function useFormSubmit<TData>(
  handler: (data: TData) => Promise<void> | void,
  options: UseFormSubmitOptions = {},
): UseFormSubmitReturn<TData> {
  const { successDuration = 3000, onSettled } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [isError, setIsError]           = useState(false);
  const [error, setError]               = useState<Error | null>(null);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const submit = useCallback(
    async (data: TData) => {
      if (isSubmitting) return;
      reset();
      setIsSubmitting(true);

      try {
        await handler(data);
        setIsSuccess(true);
        timerRef.current = setTimeout(() => {
          setIsSuccess(false);
          onSettled?.();
        }, successDuration);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err; // Re-throw so the Form component can handle server errors
      } finally {
        setIsSubmitting(false);
      }
    },
    [handler, isSubmitting, reset, successDuration, onSettled],
  );

  return { isSubmitting, isSuccess, isError, error, submit, reset };
}
