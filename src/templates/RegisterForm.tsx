import { useState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { Form } from '../form/Form';
import { FormSection } from '../form/FormSection';
import { FormGrid } from '../form/FormGrid';
import { FormActions } from '../form/FormActions';
import { TextField } from '../fields/TextField';
import { EmailField } from '../fields/EmailField';
import { PasswordField } from '../fields/PasswordField';
import { CheckboxField } from '../fields/CheckboxField';
import { registerSchema, type RegisterFormData } from '../validation/schemas';
import { FormPlayground } from '../components/FormPlayground';

// ── Copy-pasteable Code String ──────────────────────────────────────────────
const codeString = `// ── SETUP INSTRUCTIONS ───────────────────────────────────────────────────────
// 1. Copy the standalone core code and save it as 'ResourceFlow.tsx' in your components folder.
// 2. Paste this form file in the same folder, or update the import path below.
// ─────────────────────────────────────────────────────────────────────────────
import { Form, FormSection, FormGrid, FormActions, TextField, EmailField, PasswordField, CheckboxField } from './ResourceFlow';
import { UserPlus } from 'lucide-react';
import { registerSchema, type RegisterFormData } from './validation/schemas';

export function RegisterForm() {
  const handleSubmit = async (data: RegisterFormData) => {
    // 1. Submit validated credentials to endpoint
    await api.register(data);
  };

  return (
    <Form
      schema={registerSchema}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isSuccess }) => {
        if (isSuccess) {
          return (
            <div className="py-10 flex flex-col items-center text-center gap-4">
              <h3 className="text-xl font-semibold">Account created!</h3>
              <p className="text-sm text-surface-500">
                Welcome aboard. Please check your email for a verification link.
              </p>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-5">
            <FormSection
              title="Account details"
              description="Fill in your information to create a new account."
            >
              <div className="flex flex-col gap-5">
                <FormGrid columns={2}>
                  <TextField name="firstName" label="First name" placeholder="John" required />
                  <TextField name="lastName" label="Last name" placeholder="Doe" required />
                </FormGrid>

                <EmailField name="email" label="Email address" required />

                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="Create a strong password"
                  showStrengthMeter
                  helperText="Use 8+ characters with a mix of letters, numbers & symbols."
                  required
                />

                <PasswordField
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </FormSection>

            <FormSection>
              <CheckboxField
                name="terms"
                label="I agree to the Terms of Service and Privacy Policy"
                description="By creating an account you agree to our legal terms."
                required
              />
            </FormSection>

            <FormActions align="right" showDirtyIndicator={false} className="border-0 pt-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <UserPlus size={16} aria-hidden="true" />
                Create account
              </button>
            </FormActions>
          </div>
        );
      }}
    </Form>
  );
}`;

// ── Copy-pasteable Schema String ────────────────────────────────────────────
const schemaString = `import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'Must be at least 2 characters' })
      .max(60)
      .trim(),
      
    lastName: z
      .string()
      .min(2, { message: 'Must be at least 2 characters' })
      .max(60)
      .trim(),
      
    email: z
      .string()
      .min(1, { message: 'Required' })
      .email({ message: 'Please enter a valid email address' })
      .toLowerCase()
      .trim(),
      
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])/, {
        message: 'Must include uppercase, lowercase, number, and special character',
      }),
      
    confirmPassword: z
      .string()
      .min(1, { message: 'Required' }),
      
    terms: z
      .boolean()
      .refine((v) => v === true, { message: 'You must accept the terms to continue' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;`;

// ── Exported template ─────────────────────────────────────────────────────
export function RegisterForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <FormPlayground
      title="Create your account"
      description="Join thousands of teams building better products. Demonstrates grid alignment, dynamic password meters, and multi-field validation."
      filename="RegisterForm.tsx"
      code={codeString}
      schemaFilename="schemas.ts"
      schema={schemaString}
    >
      <Form<RegisterFormData>
        schema={registerSchema}
        defaultValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
        }}
        onSubmit={async () => {
          // Simulate API call
          await new Promise<void>((r) => setTimeout(r, 1600));
        }}
        onSuccess={() => setIsSuccess(true)}
      >
        {({ isSubmitting }) => {
          if (isSuccess) {
            return (
              <div className="py-10 flex flex-col items-center text-center gap-4 animate-slide-up">
                <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-700/20 flex items-center justify-center">
                  <CheckCircle2
                    size={32}
                    className="text-success-600 dark:text-success-500"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-50">
                    Account created!
                  </h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-xs leading-normal">
                    Welcome aboard. Check your email for a verification link to activate your account.
                  </p>
                </div>
                <a href="/" className="btn btn-primary mt-2 cursor-pointer">
                  Sign in now
                </a>
              </div>
            );
          }

          return (
            <div className="flex flex-col gap-5">
              <FormSection
                title="Account details"
                description="Fill in your information to create a new account."
              >
                <div className="flex flex-col gap-5">
                  <FormGrid columns={2}>
                    <TextField<RegisterFormData>
                      name="firstName"
                      label="First name"
                      placeholder="John"
                      autoComplete="given-name"
                      required
                    />
                    <TextField<RegisterFormData>
                      name="lastName"
                      label="Last name"
                      placeholder="Doe"
                      autoComplete="family-name"
                      required
                    />
                  </FormGrid>

                  <EmailField<RegisterFormData>
                    name="email"
                    label="Email address"
                    required
                  />

                  <PasswordField<RegisterFormData>
                    name="password"
                    label="Password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    showStrengthMeter
                    helperText="Use 8+ characters with a mix of upper/lowercase, numbers & symbols."
                    required
                  />

                  <PasswordField<RegisterFormData>
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </FormSection>

              <FormSection>
                <CheckboxField<RegisterFormData>
                  name="terms"
                  label="I agree to the Terms of Service and Privacy Policy"
                  description="By creating an account you agree to our legal terms."
                  required
                />
              </FormSection>

              <FormActions align="right" showDirtyIndicator={false} className="border-0 pt-2">
                <button
                  type="submit"
                  id="register-submit-btn"
                  disabled={isSubmitting}
                  className="btn btn-primary cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} aria-hidden="true" />
                      Create account
                    </>
                  )}
                </button>
              </FormActions>
            </div>
          );
        }}
      </Form>
    </FormPlayground>
  );
}
