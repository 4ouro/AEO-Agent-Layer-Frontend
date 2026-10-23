// Words the seller sees for the report's codes.
import type { Area, ScannedPage, Severity } from '@/lib/api/scans';

export const AREA_LABELS: Record<Area, string> = {
  access: 'Access',
  visibility: 'Visibility',
  productData: 'Product data',
  trust: 'Trust',
  aiCommerce: 'AI commerce',
  discovery: 'Discovery',
};

export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

export const SEVERITY_LABELS: Record<Severity, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

// Severity is the only place colours other than green appear.
export const SEVERITY_FILL: Record<Severity, string> = {
  critical: 'bg-red',
  high: 'bg-red/60',
  medium: 'bg-amber',
  low: 'bg-amber/50',
};

export const PAGE_KIND_LABELS: Record<ScannedPage['kind'], string> = { home: 'Home', product: 'Product', category: 'Category', policy: 'Policy' };

export const PLATFORM_LABELS = { shopify: 'Shopify', woocommerce: 'WooCommerce', wordpress: 'WordPress', custom: 'Custom site' } as const;

/** What each ready-made fix pack file does, in a few words. */
export const FIX_FILE_LABELS: Record<string, string> = {
  '/robots.txt': 'Lets AI search bots in',
  '/llms.txt': 'Store summary for AI',
  '/sitemap.xml': 'List of your product pages',
  '/product-feed.xml': 'Products for Google Shopping',
};

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(iso));

/** Dates in India time, where our sellers are. */
export const formatDate = (iso: string, withTime = true) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', ...(withTime && { hour: '2-digit', minute: '2-digit' }), timeZone: 'Asia/Kolkata' }).format(new Date(iso));
