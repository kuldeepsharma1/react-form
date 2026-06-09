/**
 * useDirtyState — tracks unsaved form changes and optionally warns
 * the user before navigating away from the page.
 *
 * @example
 * const { isDirty, dirtyFields, hasFieldChanged } = useDirtyState(form, {
 *   warnOnLeave: true,
 * });
 */
import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface UseDirtyStateOptions {
  /**
   * When true, the browser will show a "Leave site?" dialog if
   * the form has unsaved changes and the user tries to navigate away.
   */
  warnOnLeave?: boolean;
  /** Custom warning message (not all browsers support custom messages) */
  warnMessage?: string;
}

export interface UseDirtyStateReturn {
  /** Whether any field has changed from its default value */
  isDirty: boolean;
  /** Map of field names to whether they have changed */
  dirtyFields: Partial<Record<string, boolean>>;
  /** Check if a specific field has an unsaved change */
  hasFieldChanged: (name: string) => boolean;
}

export function useDirtyState<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  options: UseDirtyStateOptions = {},
): UseDirtyStateReturn {
  const { warnOnLeave = false } = options;
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    if (!warnOnLeave) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      // Modern browsers ignore custom messages but still show a dialog
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, warnOnLeave]);

  const hasFieldChanged = (name: string): boolean =>
    Boolean((dirtyFields as Record<string, boolean>)[name]);

  return {
    isDirty,
    dirtyFields: dirtyFields as Partial<Record<string, boolean>>,
    hasFieldChanged,
  };
}
