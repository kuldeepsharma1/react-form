/**
 * useServerErrors — maps server-side validation errors onto RHF fields.
 *
 * Supports Laravel error format `{ errors: { field: string[] } }`
 * and generic `Record<string, string | string[]>` responses.
 *
 * @example
 * const { setServerErrors } = useServerErrors(form);
 *
 * try {
 *   await api.login(data);
 * } catch (err) {
 *   setServerErrors(err.errors); // maps to individual fields
 * }
 */
import { useCallback } from 'react';
import type { FieldValues, UseFormReturn, Path } from 'react-hook-form';

export type ServerErrorMap = Record<string, string | string[]>;

/**
 * Laravel API error shape:
 * { message: string, errors: { field: string[] } }
 */
export interface LaravelErrorResponse {
  message?: string;
  errors: ServerErrorMap;
}

export interface UseServerErrorsReturn {
  /** Map a flat error record directly onto fields */
  setServerErrors: (errors: ServerErrorMap) => void;
  /** Extract and map errors from a Laravel-style response */
  setLaravelErrors: (response: LaravelErrorResponse) => void;
  /** Clear all field-level errors */
  clearServerErrors: () => void;
}

export function useServerErrors<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
): UseServerErrorsReturn {
  const setServerErrors = useCallback(
    (errors: ServerErrorMap) => {
      Object.entries(errors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        form.setError(field as Path<TFieldValues>, {
          type: 'server',
          message,
        });
      });
    },
    [form],
  );

  const setLaravelErrors = useCallback(
    (response: LaravelErrorResponse) => {
      setServerErrors(response.errors);
    },
    [setServerErrors],
  );

  const clearServerErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  return { setServerErrors, setLaravelErrors, clearServerErrors };
}
