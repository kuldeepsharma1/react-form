/**
 * form/index.ts — barrel export for all form primitives
 */
export { Form } from './Form';
export type { FormProps } from './Form';

export { FormSection } from './FormSection';
export type { FormSectionProps } from './FormSection';

export { FormGrid } from './FormGrid';
export type { FormGridProps } from './FormGrid';

export { FormActions } from './FormActions';
export type { FormActionsProps } from './FormActions';

export { FormProvider, useFormCtx } from './FormContext';
export type { FormContextValue, FormProviderProps } from './FormContext';
