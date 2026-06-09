/**
 * validation/schemas.ts
 *
 * Reusable Zod schema primitives and schema factory helpers.
 * Compose these into full form schemas without repeating validation logic.
 *
 * @example
 * const loginSchema = z.object({
 *   email: emailSchema,
 *   password: passwordSchema,
 * });
 *
 * const registerSchema = withConfirmPassword(
 *   z.object({ email: emailSchema, password: passwordSchema })
 * );
 */
import { z } from 'zod';
import { MSG } from './messages';

// ── Primitive field schemas ────────────────────────────────────────────────

/** Standard name field (first/last name, display name) */
export const nameSchema = z
  .string({ required_error: MSG.required })
  .min(2,  { message: MSG.nameTooShort })
  .max(60, { message: MSG.nameTooLong })
  .trim();

/** Email address */
export const emailSchema = z
  .string({ required_error: MSG.required })
  .min(1, { message: MSG.required })
  .email({ message: MSG.emailInvalid })
  .toLowerCase()
  .trim();

/** Password — at least 8 chars, strong pattern */
export const passwordSchema = z
  .string({ required_error: MSG.required })
  .min(8,   { message: MSG.passwordTooShort })
  .max(128, { message: MSG.passwordTooLong });

/** Strong password — additionally enforces complexity */
export const strongPasswordSchema = passwordSchema.regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
  { message: MSG.passwordWeak },
);

/** Phone number (international-ish) */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{6,14}$/, { message: MSG.phoneInvalid })
  .optional()
  .or(z.literal(''));

/** URL */
export const urlSchema = z
  .string()
  .url({ message: MSG.urlInvalid })
  .optional()
  .or(z.literal(''));

/** Must-be-true checkbox (e.g. Terms of Service) */
export const mustAcceptSchema = z
  .boolean()
  .refine((v) => v === true, { message: MSG.mustAccept });

// ── Schema factory helpers ─────────────────────────────────────────────────

/**
 * withConfirmPassword — adds a `confirmPassword` field with a `.refine()`
 * that cross-validates it against `password`.
 *
 * The base schema MUST have a `password` field of type string.
 *
 * @example
 * const schema = withConfirmPassword(
 *   z.object({ email: emailSchema, password: strongPasswordSchema })
 * );
 */
export function withConfirmPassword<
  Shape extends z.ZodRawShape & { password: z.ZodTypeAny },
>(schema: z.ZodObject<Shape>) {
  return schema
    .extend({ confirmPassword: z.string().min(1, { message: MSG.required }) })
    .refine((data) => data.password === data.confirmPassword, {
      message: MSG.passwordMismatch,
      path: ['confirmPassword'],
    });
}

// ── Pre-built complete schemas ─────────────────────────────────────────────

/** Login form */
export const loginSchema = z.object({
  email:      emailSchema,
  password:   passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});
export type LoginFormData = z.infer<typeof loginSchema>;

/** Registration form */
export const registerSchema = withConfirmPassword(
  z.object({
    firstName: nameSchema,
    lastName:  nameSchema,
    email:     emailSchema,
    password:  strongPasswordSchema,
    terms:     mustAcceptSchema,
  }),
);
export type RegisterFormData = z.infer<typeof registerSchema>;

/** User profile / CRUD form */
export const userSchema = z.object({
  firstName:    nameSchema,
  lastName:     nameSchema,
  email:        emailSchema,
  phone:        phoneSchema,
  website:      urlSchema,
  bio:          z.string().max(300, { message: 'Bio must be 300 characters or fewer.' }).optional(),
  role:         z.enum(['admin', 'editor', 'viewer'], { required_error: MSG.required }),
  timezone:     z.string().min(1, { message: MSG.required }),
  // notification preferences
  emailNotifs:  z.boolean().default(true),
  pushNotifs:   z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
});
export type UserFormData = z.infer<typeof userSchema>;
