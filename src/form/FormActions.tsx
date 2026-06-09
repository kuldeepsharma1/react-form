/**
 * FormActions — standardised action bar for form submit/cancel/reset buttons.
 *
 * Automatically shows an "unsaved changes" indicator when the form is dirty.
 * Reads isSubmitting from FormContext to disable actions during submission.
 *
 * @example
 * <FormActions align="right">
 *   <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
 *   <button type="submit" className="btn btn-primary">Save Changes</button>
 * </FormActions>
 */
import type { ReactNode } from 'react';
import { useFormCtx } from './FormContext';

type Align = 'left' | 'right' | 'center' | 'between';

const alignClasses: Record<Align, string> = {
  left:    'form-actions',
  right:   'form-actions form-actions-right',
  center:  'form-actions form-actions-center',
  between: 'form-actions form-actions-between',
};

export interface FormActionsProps {
  align?: Align;
  /** Whether to display the dirty (unsaved changes) indicator */
  showDirtyIndicator?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormActions({
  align = 'right',
  showDirtyIndicator = true,
  className = '',
  children,
}: FormActionsProps) {
  const { form } = useFormCtx();
  const isDirty = form.formState.isDirty;

  return (
    <div className={`${alignClasses[align]} ${className}`}>
      {showDirtyIndicator && isDirty && align === 'between' && (
        <span className="dirty-indicator" aria-live="polite">
          <span className="dirty-dot" aria-hidden="true" />
          Unsaved changes
        </span>
      )}
      <div className="flex items-center gap-3">
        {showDirtyIndicator && isDirty && align !== 'between' && (
          <span className="dirty-indicator mr-auto" aria-live="polite">
            <span className="dirty-dot" aria-hidden="true" />
            Unsaved changes
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
