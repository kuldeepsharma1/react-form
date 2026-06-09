import { z } from 'zod';
import type { FieldDefinition, FieldOptions, SelectFieldOptions, ResourceConfig, Resource, SelectOption } from './types';

// Helper to convert camelCase/snake_case/kebab-case into capital spaced display names
function toDisplayName(name: string): string {
  const spaced = name
    .replace(/([A-Z])/g, ' $1') // Space before capitals
    .replace(/[_-]+/g, ' ')     // Hyphen/underscore to space
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Helper to normalize options for Select component
function normalizeOptions(options: string[] | SelectOption[]): SelectOption[] {
  return options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });
}

// Field builder helper
export const field = {
  text(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'text',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  textarea(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'textarea',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'full', // Textareas default to full-width
    };
  },

  number(name: string, options?: FieldOptions<number>): FieldDefinition {
    return {
      name,
      type: 'number',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '', // Keep empty string by default to allow empty state
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  boolean(name: string, options?: FieldOptions<boolean>): FieldDefinition {
    return {
      name,
      type: 'boolean',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? false,
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  email(name: string, options?: FieldOptions<string>): FieldDefinition {
    return {
      name,
      type: 'email',
      label: options?.label ?? toDisplayName(name),
      placeholder: options?.placeholder,
      helperText: options?.helperText,
      required: options?.required !== false,
      defaultValue: options?.defaultValue ?? '',
      gridSpan: options?.gridSpan ?? 'half',
    };
  },

  select(name: string, options: SelectFieldOptions): FieldDefinition {
    const normalized = normalizeOptions(options.options);
    return {
      name,
      type: 'select',
      label: options.label ?? toDisplayName(name),
      placeholder: options.placeholder ?? 'Select an option...',
      helperText: options.helperText,
      required: options.required !== false,
      options: normalized,
      defaultValue: options.defaultValue ?? (normalized[0]?.value ?? ''),
      gridSpan: options.gridSpan ?? 'half',
    };
  },
};

export function defineResource(config: ResourceConfig): Resource {
  const fields = config.fields as FieldDefinition[];
  const pluralName = config.pluralName ?? `${config.name}s`;

  // Compile Zod schema dynamically
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  for (const f of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (f.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      case 'email':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        }
        fieldSchema = (fieldSchema as z.ZodString).email('Invalid email address');
        if (!f.required) {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      case 'number':
        // Safe parsing for form text inputs to prevent empty strings coercion to 0
        fieldSchema = z.preprocess(
          (val) => {
            if (val === '' || val === undefined || val === null) return undefined;
            const num = Number(val);
            return isNaN(num) ? val : num; // Return as-is if truly not a number, so Zod validator flags it
          },
          f.required
            ? z.number({ required_error: `${f.label} is required`, invalid_type_error: `${f.label} must be a number` })
            : z.number({ invalid_type_error: `${f.label} must be a number` }).optional()
        );
        break;

      case 'boolean':
        fieldSchema = z.boolean().default(false);
        break;

      case 'select':
        fieldSchema = z.string();
        if (f.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${f.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(''));
        }
        break;

      default:
        fieldSchema = z.any();
    }

    schemaShape[f.name] = fieldSchema;
    defaultValues[f.name] = f.defaultValue;
  }

  return {
    name: config.name,
    pluralName,
    fields,
    schema: z.object(schemaShape),
    defaultValues,
  };
}
