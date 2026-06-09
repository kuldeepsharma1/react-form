import { defineResource, field } from './resource';

export const UserResource = defineResource({
  name: 'User',
  pluralName: 'Users',
  fields: [
    field.text('name', { label: 'Full Name', placeholder: 'Jane Doe', helperText: 'First and last name' }),
    field.email('email', { label: 'Email Address', placeholder: 'jane@example.com' }),
    field.select('role', {
      label: 'System Role',
      options: ['Admin', 'Manager', 'User'],
      defaultValue: 'User',
    }),
    field.boolean('active', { label: 'Active Status', defaultValue: true }),
  ],
});

export const ProductResource = defineResource({
  name: 'Product',
  pluralName: 'Products',
  fields: [
    field.text('title', { label: 'Product Title', placeholder: 'Wireless Headphones' }),
    field.textarea('description', { label: 'Product Description', placeholder: 'High fidelity audio, 40h battery, active noise cancelling...' }),
    field.number('price', { label: 'Price (USD)', placeholder: '199.99' }),
    field.boolean('active', { label: 'Active / Listed', defaultValue: true }),
  ],
});

export const OrderResource = defineResource({
  name: 'Order',
  pluralName: 'Orders',
  fields: [
    field.text('orderNumber', { label: 'Order Number', placeholder: 'ORD-9848-X' }),
    field.email('customerEmail', { label: 'Customer Email', placeholder: 'customer@domain.com' }),
    field.select('status', {
      label: 'Order Status',
      options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      defaultValue: 'Pending',
    }),
    field.number('total', { label: 'Total Amount ($)', placeholder: '0.00' }),
    field.boolean('paid', { label: 'Payment Completed', defaultValue: false }),
  ],
});

export const CustomerResource = defineResource({
  name: 'Customer',
  pluralName: 'Customers',
  fields: [
    field.text('name', { label: 'Customer Name', placeholder: 'Acme Corp' }),
    field.email('email', { label: 'Billing Email', placeholder: 'finance@acme.com' }),
    field.text('company', { label: 'Company Name', placeholder: 'Acme Inc.' }),
    field.select('status', {
      label: 'Customer Status',
      options: ['Active', 'Inactive', 'Lead'],
      defaultValue: 'Lead',
    }),
    field.number('ltv', { label: 'Lifetime Value (USD)', placeholder: '2500.00', defaultValue: 0 }),
  ],
});

export const TeamResource = defineResource({
  name: 'Team',
  pluralName: 'Teams',
  fields: [
    field.text('name', { label: 'Team Name', placeholder: 'Growth Marketing' }),
    field.textarea('description', { label: 'Team Description', placeholder: 'Focused on developer adoption, tutorials, and partner ecosystem...' }),
    field.select('plan', {
      label: 'Subscription Plan',
      options: ['Free', 'Growth', 'Enterprise'],
      defaultValue: 'Free',
    }),
    field.boolean('active', { label: 'Status Active', defaultValue: true }),
  ],
});

export const ProjectResource = defineResource({
  name: 'Project',
  pluralName: 'Projects',
  fields: [
    field.text('name', { label: 'Project Name', placeholder: 'Website Replatforming' }),
    field.textarea('description', { label: 'Project Scope', placeholder: 'Migrate legacy marketing site to Next.js and Tailwind v4...' }),
    field.select('priority', {
      label: 'Priority Level',
      options: ['Low', 'Medium', 'High'],
      defaultValue: 'Medium',
    }),
    field.number('budget', { label: 'Project Budget (USD)', placeholder: '15000' }),
    field.boolean('completed', { label: 'Mark Completed', defaultValue: false }),
  ],
});

export const resourcesRegistry = {
  users: UserResource,
  products: ProductResource,
  orders: OrderResource,
  customers: CustomerResource,
  teams: TeamResource,
  projects: ProjectResource,
};

export type ResourceId = keyof typeof resourcesRegistry;
export const resourcesList = Object.entries(resourcesRegistry).map(([id, resource]) => ({
  id: id as ResourceId,
  resource,
}));
