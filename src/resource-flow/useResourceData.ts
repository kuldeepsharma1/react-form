import { useState, useEffect } from 'react';
import type { Resource } from './types';

// Structured seed data for each resource
const MOCK_SEEDS: Record<string, any[]> = {
  User: [
    { id: 'usr_1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', active: true },
    { id: 'usr_2', name: 'Bob Jones', email: 'bob@example.com', role: 'User', active: true },
    { id: 'usr_3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager', active: false },
    { id: 'usr_4', name: 'Diana Prince', email: 'diana@example.com', role: 'User', active: true },
    { id: 'usr_5', name: 'Evan Wright', email: 'evan@example.com', role: 'User', active: false },
  ],
  Product: [
    { id: 'prod_1', title: 'iPhone 15 Pro', description: 'Apple flagship smartphone with titanium design and A17 Pro chip.', price: 999.99, active: true },
    { id: 'prod_2', title: 'MacBook Pro 16"', description: 'Apple silicon laptop with M3 Max, 32GB unified memory, and liquid retina XDR.', price: 2499.00, active: true },
    { id: 'prod_3', title: 'AirPods Pro 2', description: 'True wireless earbuds featuring active noise cancellation and adaptive transparency.', price: 249.00, active: true },
    { id: 'prod_4', title: 'iPad Pro M4', description: 'Ultra-thin tablet with tandem OLED panel, powerful M4 processor, and Pencil Pro support.', price: 1199.00, active: false },
    { id: 'prod_5', title: 'Apple Watch Ultra 2', description: 'Rugged sports smartwatch with high-brightness display and dual-frequency GPS.', price: 799.00, active: true },
  ],
  Order: [
    { id: 'ord_1', orderNumber: 'ORD-2026-001', customerEmail: 'alice@example.com', status: 'Delivered', total: 1248.99, paid: true },
    { id: 'ord_2', orderNumber: 'ORD-2026-002', customerEmail: 'bob@example.com', status: 'Processing', total: 249.00, paid: true },
    { id: 'ord_3', orderNumber: 'ORD-2026-003', customerEmail: 'charlie@example.com', status: 'Pending', total: 999.00, paid: false },
    { id: 'ord_4', orderNumber: 'ORD-2026-004', customerEmail: 'diana@example.com', status: 'Shipped', total: 799.00, paid: true },
    { id: 'ord_5', orderNumber: 'ORD-2026-005', customerEmail: 'evan@example.com', status: 'Cancelled', total: 199.99, paid: false },
  ],
  Customer: [
    { id: 'cust_1', name: 'TechCorp Solutions', email: 'billing@techcorp.com', company: 'TechCorp Inc.', status: 'Active', ltv: 15400.00 },
    { id: 'cust_2', name: 'DevStudio HQ', email: 'contact@devstudio.io', company: 'DevStudio', status: 'Lead', ltv: 0.00 },
    { id: 'cust_3', name: 'Globex Enterprise', email: 'invoices@globex.org', company: 'Globex Corp', status: 'Active', ltv: 45000.00 },
    { id: 'cust_4', name: 'Acme Retail', email: 'buyer@acme.com', company: 'Acme Corporation', status: 'Inactive', ltv: 1200.00 },
    { id: 'cust_5', name: 'Initech Systems', email: 'peter@initech.com', company: 'Initech LLC', status: 'Lead', ltv: 500.00 },
  ],
  Team: [
    { id: 'team_1', name: 'Platform Engineering', description: 'Responsible for infrastructure, CI/CD pipelines, system availability, and developer toolchain.', plan: 'Enterprise', active: true },
    { id: 'team_2', name: 'Core Design Systems', description: 'Owns reusable UI components, accessibility guidelines, standard layouts, and dark mode audits.', plan: 'Growth', active: true },
    { id: 'team_3', name: 'QA & Test Automation', description: 'Performs integration tests, load tests, and verifies critical workflows prior to production releases.', plan: 'Free', active: false },
    { id: 'team_4', name: 'Global Developer Relations', description: 'Fosters adopting our API, creates high-quality starter templates, and gathers community feedback.', plan: 'Growth', active: true },
  ],
  Project: [
    { id: 'proj_1', name: 'AWS Cloud Migration', description: 'Migrate legacy physical server setups onto redundant AWS cloud infrastructure with zero-downtime database migration.', priority: 'High', budget: 50000, completed: false },
    { id: 'proj_2', name: 'OAuth2 / Passwordless Login', description: 'Integrate passkeys, magic link authentication, and token-based API scopes for enterprise single-sign-on (SSO).', priority: 'Medium', budget: 12000, completed: true },
    { id: 'proj_3', name: 'Tailwind v4 Clean-up', description: 'Remove deprecated configuration classes and transition theme variables into index.css custom-variant format.', priority: 'Low', budget: 3500, completed: true },
    { id: 'proj_4', name: 'Stripe Billing Upgrades', description: 'Incorporate tiered meter-based pricing, subscription lifecycle events, checkout sessions, and credit card retries.', priority: 'High', budget: 20000, completed: false },
  ],
};

export function useResourceData(resource: Resource) {
  const storageKey = `rf_resource_data_${resource.name}`;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load items from local storage or seed them
  useEffect(() => {
    setLoading(true);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        // Fallback if corrupt
        const seeds = MOCK_SEEDS[resource.name] || [];
        setItems(seeds);
        localStorage.setItem(storageKey, JSON.stringify(seeds));
      }
    } else {
      const seeds = MOCK_SEEDS[resource.name] || [];
      setItems(seeds);
      localStorage.setItem(storageKey, JSON.stringify(seeds));
    }
    setLoading(false);
  }, [storageKey, resource.name]);

  // Save changes helper
  const saveItems = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem(storageKey, JSON.stringify(newItems));
  };

  const createItem = (data: any) => {
    const newItem = {
      ...data,
      id: `${resource.name.toLowerCase()}_${Date.now()}`,
    };
    saveItems([newItem, ...items]);
    return newItem;
  };

  const updateItem = (id: string, data: any) => {
    const updated = items.map((item) => (item.id === id ? { ...item, ...data } : item));
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
  };

  const bulkDelete = (ids: string[]) => {
    const updated = items.filter((item) => !ids.includes(item.id));
    saveItems(updated);
  };

  const resetToSeeds = () => {
    const seeds = MOCK_SEEDS[resource.name] || [];
    saveItems(seeds);
  };

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    bulkDelete,
    resetToSeeds,
  };
}
