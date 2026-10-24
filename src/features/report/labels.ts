// Words the seller sees for the report's codes.
import type { Area, BusinessType, ScannedPage, Severity } from '@/lib/api/scans';

export const AREA_LABELS: Record<Area, string> = {
  access: 'Access',
  visibility: 'Visibility',
  productData: 'Product data',
  trust: 'Trust',
  aiCommerce: 'AI files',
  discovery: 'Discovery',
  offering: 'Your offer',
};

// One line on what each area covers (shown as a tooltip).
export const AREA_DETAILS: Record<Area, string> = {
  access: 'Firewalls and robots.txt let AI bots in',
  visibility: 'Key content readable without JavaScript',
  productData: 'Products, pricing or services in a form AI reads',
  trust: 'Contact, policies and who you are',
  aiCommerce: 'llms.txt and AI-friendly files',
  discovery: 'Sitemap, speed and broken pages',
  offering: 'Products, pricing or services in a form AI reads',
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  store: 'Store',
  software: 'Software',
  services: 'Services',
  local: 'Local business',
  publisher: 'Publisher',
  other: 'Other',
};

/** Store wording only for stores (and old reports, which were store-only). */
export const isStoreReport = (types: BusinessType[] | undefined) => !types || types.length === 0 || types.includes('store');

export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

export const SEVERITY_LABELS: Record<Severity, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

// Severity is the only place colours other than green appear.
export const SEVERITY_FILL: Record<Severity, string> = {
  critical: 'bg-red',
  high: 'bg-red/60',
  medium: 'bg-amber',
  low: 'bg-amber/50',
};

export const PAGE_KIND_LABELS: Record<ScannedPage['kind'], string> = {
  home: 'Home', product: 'Product',
  category: 'Category',
  policy: 'Policy',
  about: 'About',
  contact: 'Contact',
  pricing: 'Pricing',
  features: 'Features',
  docs: 'Docs',
  service: 'Service',
  'case-study': 'Case study',
};

export const PLATFORM_LABELS = { shopify: 'Shopify', woocommerce: 'WooCommerce', wordpress: 'WordPress', custom: 'Custom site' } as const;

/** What each ready-made fix pack file does, in a few words. */
export const FIX_FILE_LABELS: Record<string, string> = {
  '/robots.txt': 'Lets AI search bots in',
  '/llms.txt': 'Site summary for AI',
  '/sitemap.xml': 'List of your pages',
  '/product-feed.xml': 'Products for Google Shopping',
};

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

/** Dates in India time, where our sellers are. */
export const formatDate = (iso: string, withTime = true) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', ...(withTime && { hour: '2-digit', minute: '2-digit' }), timeZone: 'Asia/Kolkata' }).format(new Date(iso));
