import { z } from 'zod';

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'email' | 'select';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldOptions<T = any> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  defaultValue?: T;
  gridSpan?: 'full' | 'half';
}

export interface SelectFieldOptions<T = any> extends FieldOptions<T> {
  options: string[] | SelectOption[];
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  defaultValue: any;
  options?: SelectOption[];
  gridSpan: 'full' | 'half';
}

export interface ResourceConfig {
  name: string;
  pluralName?: string;
  fields: any[]; // field return signatures
}

export interface Resource {
  name: string;
  pluralName: string;
  fields: FieldDefinition[];
  schema: z.ZodObject<any>;
  defaultValues: Record<string, any>;
}
