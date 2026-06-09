/**
 * validation/messages.ts
 *
 * Centralised, consistent error message constants.
 * Import from here instead of writing inline strings so that all
 * validation messages are uniform across the entire application.
 */

export const MSG = {
  // Generic
  required:        'This field is required.',
  invalid:         'Please enter a valid value.',
  // Name
  nameTooShort:    'Must be at least 2 characters.',
  nameTooLong:     'Must be 60 characters or fewer.',
  // Email
  emailInvalid:    'Please enter a valid email address.',
  // Password
  passwordTooShort:'Password must be at least 8 characters.',
  passwordTooLong: 'Password must be 128 characters or fewer.',
  passwordWeak:    'Include uppercase, lowercase, a number and a symbol.',
  passwordMismatch:'Passwords do not match.',
  // Phone
  phoneInvalid:    'Please enter a valid phone number.',
  // URL
  urlInvalid:      'Please enter a valid URL (https://…).',
  // Checkbox
  mustAccept:      'You must accept this to continue.',
} as const;
