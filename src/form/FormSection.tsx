/**
 * FormSection — visual grouping primitive.
 *
 * Creates a titled section with an optional description and divider.
 * Consecutive <FormSection> elements are separated automatically by CSS.
 *
 * @example
 * <FormSection title="Personal Information" description="Update your name and avatar.">
 *   <TextField name="firstName" label="First Name" />
 * </FormSection>
 */
import type { ReactNode } from 'react';

export interface FormSectionProps {
  title?: string;
  description?: string;
  /** Optional badge displayed next to the title (e.g. "Required") */
  badge?: string;
  className?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  badge,
  className = '',
  children,
}: FormSectionProps) {
  return (
    <div className={`form-section ${className}`}>
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              <h3 className="form-section-title">{title}</h3>
              {badge && <span className="badge badge-primary">{badge}</span>}
            </div>
          )}
          {description && (
            <p className="form-section-desc">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
