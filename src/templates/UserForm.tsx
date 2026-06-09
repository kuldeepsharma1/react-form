import { useState } from 'react';
import { Save, CheckCircle2, AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { Form } from '../form/Form';
import { FormSection } from '../form/FormSection';
import { FormGrid } from '../form/FormGrid';
import { FormActions } from '../form/FormActions';
import { TextField } from '../fields/TextField';
import { EmailField } from '../fields/EmailField';
import { TextAreaField } from '../fields/TextAreaField';
import { SelectField } from '../fields/SelectField';
import { SwitchField } from '../fields/SwitchField';
import { useDirtyState } from '../hooks/useDirtyState';
import { userSchema, type UserFormData } from '../validation/schemas';
import { FormPlayground } from '../components/FormPlayground';

// ── Constants ──────────────────────────────────────────────────────────────
const defaultUser: UserFormData = {
  firstName:    'Jordan',
  lastName:     'Rivera',
  email:        'jordan@example.com',
  phone:        '',
  website:      '',
  bio:          'Senior product designer focused on design systems and accessibility.',
  role:         'editor',
  timezone:     'America/New_York',
  emailNotifs:  true,
  pushNotifs:   false,
  weeklyDigest: true,
};

const roleOptions = [
  { value: 'admin',  label: 'Admin — full access' },
  { value: 'editor', label: 'Editor — can create and edit' },
  { value: 'viewer', label: 'Viewer — read-only access' },
];

const timezoneOptions = [
  { value: 'America/New_York',    label: 'Eastern Time (ET)' },
  { value: 'America/Chicago',     label: 'Central Time (CT)' },
  { value: 'America/Denver',      label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London',       label: 'London (GMT/BST)' },
  { value: 'Europe/Paris',        label: 'Central European (CET)' },
  { value: 'Asia/Kolkata',        label: 'India (IST)' },
  { value: 'Asia/Tokyo',          label: 'Japan (JST)' },
  { value: 'Australia/Sydney',    label: 'Sydney (AEST)' },
];

// ── Copy-pasteable Code String ──────────────────────────────────────────────
const codeString = `// ── SETUP INSTRUCTIONS ───────────────────────────────────────────────────────
// 1. Copy the standalone core code and save it as 'ResourceFlow.tsx' in your components folder.
// 2. Paste this form file in the same folder, or update the import path below.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Form, FormSection, FormGrid, FormActions, TextField, EmailField, TextAreaField, SelectField, SwitchField } from './ResourceFlow';
import { useDirtyState } from './hooks/useDirtyState';
import { Save, RotateCcw } from 'lucide-react';
import { userSchema, type UserFormData } from './validation/schemas';

export function UserForm() {
  const [key, setKey] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    // 1. Submit validated profile data to endpoint
    await api.updateProfile(data);
  };

  const handleCancel = () => {
    setKey((k) => k + 1); // Reset form values
    setIsSuccess(false);
  };

  return (
    <Form
      key={key}
      schema={userSchema}
      defaultValues={defaultUser}
      onSubmit={handleSubmit}
      onSuccess={() => {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }}
    >
      {({ isSubmitting, form }) => {
        const { isDirty } = useDirtyState(form);

        return (
          <div className="flex flex-col gap-5">
            {isSuccess && (
              <div className="form-success-banner">
                <span className="font-medium text-sm">Profile updated successfully.</span>
              </div>
            )}

            <FormSection title="Personal Information" description="Your public profile information.">
              <FormGrid columns={2}>
                <TextField name="firstName" label="First name" required />
                <TextField name="lastName" label="Last name" required />
              </FormGrid>
              <FormGrid columns={2}>
                <TextField name="phone" label="Phone number" placeholder="+1 555 000 0000" />
                <TextField name="website" label="Website" placeholder="https://yoursite.com" />
              </FormGrid>
              <TextAreaField name="bio" label="Bio" maxLength={300} showCount />
            </FormSection>

            <FormSection title="Account Settings" description="Credentials and permissions.">
              <EmailField name="email" label="Email address" required />
              <FormGrid columns={2}>
                <SelectField name="role" label="Role" options={roleOptions} required />
                <SelectField name="timezone" label="Timezone" options={timezoneOptions} required />
              </FormGrid>
            </FormSection>

            <FormSection title="Notifications" description="Email and push notifications.">
              <div className="flex flex-col divide-y divide-surface-100 dark:divide-surface-700">
                <SwitchField name="emailNotifs" label="Email notifications" />
                <SwitchField name="pushNotifs" label="Push notifications" />
                <SwitchField name="weeklyDigest" label="Weekly digest" />
              </div>
            </FormSection>

            <FormActions align="between">
              <button type="button" onClick={handleCancel} className="btn btn-ghost btn-sm">
                <RotateCcw size={14} />
                {isDirty ? 'Discard changes' : 'Reset'}
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                <Save size={15} />
                Save changes
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

export const userSchema = z.object({
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
    
  phone: z
    .string()
    .regex(/^\\+?[1-9]\\d{6,14}$/, { message: 'Invalid phone number format' })
    .optional()
    .or(z.literal('')),
    
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
    
  bio: z
    .string()
    .max(300, { message: 'Bio must be 300 characters or fewer' })
    .optional(),
    
  role: z
    .enum(['admin', 'editor', 'viewer'], { required_error: 'Required' }),
    
  timezone: z
    .string()
    .min(1, { message: 'Required' }),
    
  emailNotifs: z.boolean().default(true),
  pushNotifs: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;`;

// ── Component ──────────────────────────────────────────────────────────────
export function UserForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [key, setKey] = useState(0); // key trick to reset the form

  const handleSubmit = async (data: UserFormData): Promise<void> => {
    await new Promise<void>((r) => setTimeout(r, 1500));
    if (data.email === 'taken@example.com') {
      throw {
        errors: { email: ['This email address is already in use by another account.'] },
      };
    }
  };

  const handleCancel = () => {
    // Reset by remounting the Form
    setKey((k) => k + 1);
    setIsSuccess(false);
  };

  return (
    <FormPlayground
      title="Profile settings"
      description="Manage your personal information, account settings, and preferences. Demonstrates multi-section layouts, toggle switches, and unsaved changes tracking."
      filename="UserForm.tsx"
      code={codeString}
      schemaFilename="schemas.ts"
      schema={schemaString}
    >
      <Form<UserFormData>
        key={key}
        schema={userSchema}
        defaultValues={defaultUser}
        onSubmit={handleSubmit}
        onSuccess={() => {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 4000);
        }}
      >
        {({ isSubmitting, form }) => {
          const { isDirty } = useDirtyState(form);

          return (
            <div className="flex flex-col gap-5 animate-fade-in">
              {/* Success banner */}
              {isSuccess && (
                <div className="form-success-banner animate-slide-down">
                  <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-sm">Profile updated successfully.</p>
                    <p className="text-xs opacity-75 mt-0.5">Your changes have been saved.</p>
                  </div>
                </div>
              )}

              {/* Server error demo */}
              <div className="flex items-start gap-2.5 p-3 mb-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  <strong>Demo hint:</strong> Change email to{' '}
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded">
                    taken@example.com
                  </code>{' '}
                  to simulate an email-already-exists server error.
                </p>
              </div>

              {/* ── Personal Information ── */}
              <FormSection
                title="Personal Information"
                description="Your public profile information."
              >
                <div className="flex flex-col gap-5">
                  <FormGrid columns={2}>
                    <TextField<UserFormData>
                      name="firstName"
                      label="First name"
                      autoComplete="given-name"
                      required
                    />
                    <TextField<UserFormData>
                      name="lastName"
                      label="Last name"
                      autoComplete="family-name"
                      required
                    />
                  </FormGrid>

                  <FormGrid columns={2}>
                    <TextField<UserFormData>
                      name="phone"
                      label="Phone number"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      autoComplete="tel"
                      helperText="Include country code."
                    />
                    <TextField<UserFormData>
                      name="website"
                      label="Website"
                      type="url"
                      placeholder="https://yoursite.com"
                      autoComplete="url"
                    />
                  </FormGrid>

                  <TextAreaField<UserFormData>
                    name="bio"
                    label="Bio"
                    placeholder="Tell us a little about yourself…"
                    rows={3}
                    maxLength={300}
                    showCount
                    helperText="Appears on your public profile."
                  />
                </div>
              </FormSection>

              {/* ── Account Settings ── */}
              <FormSection
                title="Account Settings"
                description="Manage your login credentials and permissions."
              >
                <div className="flex flex-col gap-5">
                  <EmailField<UserFormData>
                    name="email"
                    label="Email address"
                    required
                  />
                  <FormGrid columns={2}>
                    <SelectField<UserFormData>
                      name="role"
                      label="Role"
                      options={roleOptions}
                      required
                    />
                    <SelectField<UserFormData>
                      name="timezone"
                      label="Timezone"
                      options={timezoneOptions}
                      required
                    />
                  </FormGrid>
                </div>
              </FormSection>

              {/* ── Notification Preferences ── */}
              <FormSection
                title="Notifications"
                description="Control how and when you receive notifications."
              >
                <div className="flex flex-col divide-y divide-surface-100 dark:divide-surface-700">
                  <div className="py-3 first:pt-0">
                    <SwitchField<UserFormData>
                      name="emailNotifs"
                      label="Email notifications"
                      description="Receive account updates, security alerts, and announcements."
                    />
                  </div>
                  <div className="py-3">
                    <SwitchField<UserFormData>
                      name="pushNotifs"
                      label="Push notifications"
                      description="Get real-time alerts in your browser."
                    />
                  </div>
                  <div className="py-3 last:pb-0">
                    <SwitchField<UserFormData>
                      name="weeklyDigest"
                      label="Weekly digest"
                      description="A summary of your activity delivered every Monday."
                    />
                  </div>
                </div>
              </FormSection>

              {/* ── Actions ── */}
              <FormActions align="between">
                <button
                  type="button"
                  id="user-cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="btn btn-ghost btn-sm cursor-pointer"
                  aria-label="Discard changes"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  {isDirty ? 'Discard changes' : 'Reset'}
                </button>

                <button
                  type="submit"
                  id="user-save-btn"
                  disabled={isSubmitting}
                  className="btn btn-primary cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={15} aria-hidden="true" />
                      Save changes
                    </>
                  )}
                </button>
              </FormActions>

              {/* ── Danger Zone ── */}
              <div className="mt-8 pt-6 border-t border-danger-200 dark:border-danger-900/40">
                <h3 className="text-sm font-semibold text-danger-600 dark:text-danger-400 mb-1">
                  Danger Zone
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  type="button"
                  id="delete-account-btn"
                  className="btn btn-danger btn-sm cursor-pointer"
                  onClick={() => alert('Demo: Account deletion would be confirmed in a modal.')}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Delete account
                </button>
              </div>
            </div>
          );
        }}
      </Form>
    </FormPlayground>
  );
}
