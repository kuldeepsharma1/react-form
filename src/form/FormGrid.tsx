/**
 * FormGrid — CSS Grid layout primitive for form fields.
 *
 * Provides a responsive multi-column layout that collapses gracefully
 * on smaller viewports.
 *
 * @example
 * <FormGrid columns={2}>
 *   <TextField name="firstName" label="First Name" />
 *   <TextField name="lastName" label="Last Name" />
 * </FormGrid>
 */
import type { ReactNode } from 'react';

type Columns = 1 | 2 | 3 | 4;
type Gap = 'sm' | 'md' | 'lg';

const colClasses: Record<Columns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gapClasses: Record<Gap, string> = {
  sm: 'gap-3',
  md: 'gap-5',
  lg: 'gap-6',
};

export interface FormGridProps {
  columns?: Columns;
  gap?: Gap;
  className?: string;
  children: ReactNode;
}

export function FormGrid({
  columns = 2,
  gap = 'md',
  className = '',
  children,
}: FormGridProps) {
  return (
    <div className={`grid ${colClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}
