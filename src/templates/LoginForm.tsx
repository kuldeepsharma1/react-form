import { useState } from 'react';
import { CheckCircle2, LogIn, AlertTriangle } from 'lucide-react';
import { Form } from '../form/Form';
import { FormActions } from '../form/FormActions';
import { EmailField } from '../fields/EmailField';
import { PasswordField } from '../fields/PasswordField';
import { CheckboxField } from '../fields/CheckboxField';
import { loginSchema, type LoginFormData } from '../validation/schemas';
import { FormPlayground } from '../components/FormPlayground';

// ── Copy-pasteable Code String ──────────────────────────────────────────────
const codeString = `// ── SETUP INSTRUCTIONS ───────────────────────────────────────────────────────
// 1. Copy the standalone core code and save it as 'ResourceFlow.tsx' in your components folder.
// 2. Paste this form file in the same folder, or update the import path below.
// ─────────────────────────────────────────────────────────────────────────────
import { Form, EmailField, PasswordField, CheckboxField, FormActions } from './ResourceFlow';
import { LogIn } from 'lucide-react';
import { loginSchema, type LoginFormData } from './validation/schemas';

export function LoginForm() {
  const handleSubmit = async (data: LoginFormData) => {
    // 1. Submit validated data to your auth endpoint
    await api.login(data);
  };

  return (
    <Form
      schema={loginSchema}
      defaultValues={{ email: '', password: '', rememberMe: false }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isSuccess }) => (
        <div className="flex flex-col gap-5">
          {isSuccess && (
            <div className="form-success-banner">
              <span className="font-medium text-sm">Signed in successfully!</span>
            </div>
          )}

          <EmailField name="email" label="Email address" required />
          
          <PasswordField name="password" label="Password" required />

          <div className="flex items-center justify-between mt-1">
            <CheckboxField name="rememberMe" label="Remember me" />
            <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <FormActions align="right" showDirtyIndicator={false} className="border-0 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </FormActions>
        </div>
      )}
    </Form>
  );
}`;

// ── Copy-pasteable Schema String ────────────────────────────────────────────
const schemaString = `import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'This field is required' })
    .min(1, { message: 'This field is required' })
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),
    
  password: z
    .string({ required_error: 'This field is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password is too long' }),
    
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;`;

// ── Component ──────────────────────────────────────────────────────────────
export function LoginForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: LoginFormData): Promise<void> => {
    // Simulate network latency
    await new Promise<void>((resolve) => setTimeout(resolve, 1400));

    // Demo: trigger a server error with a special email
    if (data.email === 'error@demo.com') {
      throw {
        errors: { email: ['This email address is not registered in our system.'] },
      };
    }
    // Success — in a real app you'd call your auth API here
  };

  return (
    <FormPlayground
      title="Welcome back"
      description="Sign in to your account to continue. Demonstrates layout alignment, validation state, and server error mapping."
      filename="LoginForm.tsx"
      code={codeString}
      schemaFilename="schemas.ts"
      schema={schemaString}
    >
      {/* Server-error demo hint */}
      <div className="flex items-start gap-2.5 p-3 mb-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
        <AlertTriangle
          size={14}
          className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          <strong>Demo hint:</strong> Submit with{' '}
          <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded">
            error@demo.com
          </code>{' '}
          to see server-side error mapping in action.
        </p>
      </div>

      <Form<LoginFormData>
        schema={loginSchema}
        defaultValues={{ email: '', password: '', rememberMe: false }}
        onSubmit={handleSubmit}
        onSuccess={() => {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 4000);
        }}
      >
        {({ isSubmitting }) => (
          <div className="flex flex-col gap-5">
            {isSuccess && (
              <div className="form-success-banner">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">Signed in successfully!</p>
                  <p className="text-xs opacity-75 mt-0.5">Redirecting you to the dashboard…</p>
                </div>
              </div>
            )}

            <EmailField<LoginFormData>
              name="email"
              label="Email address"
              required
            />
            
            <PasswordField<LoginFormData>
              name="password"
              label="Password"
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between mt-1">
              <CheckboxField<LoginFormData>
                name="rememberMe"
                label="Remember me"
              />
              <a
                href="#"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            <FormActions align="right" showDirtyIndicator={false} className="border-0 pt-2">
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                className="btn btn-primary btn-full cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} aria-hidden="true" />
                    Sign in
                  </>
                )}
              </button>
            </FormActions>
          </div>
        )}
      </Form>
    </FormPlayground>
  );
}
