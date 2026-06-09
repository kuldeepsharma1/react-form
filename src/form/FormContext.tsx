/**
 * FormContext
 *
 * Provides the React Hook Form context to all child field components.
 * Typed generically so that field components get full type inference
 * from the parent schema.
 */
import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

// ── Context value shape ────────────────────────────────────────────────────
export interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  /** The full RHF form instance */
  form: UseFormReturn<TFieldValues>;
  /** Whether the form is currently in a loading/submitting state */
  isSubmitting: boolean;
  /** Whether the last submission was successful */
  isSuccess: boolean;
  /** Map server-style errors (e.g. Laravel) onto individual fields */
  setServerErrors: (errors: Record<string, string | string[]>) => void;
}

// ── Create context ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextValue<any> | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────
export interface FormProviderProps<TFieldValues extends FieldValues> {
  value: FormContextValue<TFieldValues>;
  children: ReactNode;
}

export function FormProvider<TFieldValues extends FieldValues>({
  value,
  children,
}: FormProviderProps<TFieldValues>) {
  return <FormContext value={value}>{children}</FormContext>;
}

// ── Consumer hook ──────────────────────────────────────────────────────────
/**
 * useFormContext — consume the form context inside any field or layout
 * component. Throws a descriptive error if used outside a <Form> wrapper.
 */
export function useFormCtx<
  TFieldValues extends FieldValues = FieldValues,
>(): FormContextValue<TFieldValues> {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      '[FormContext] useFormCtx must be used inside a <Form> component.',
    );
  }
  return ctx as FormContextValue<TFieldValues>;
}
