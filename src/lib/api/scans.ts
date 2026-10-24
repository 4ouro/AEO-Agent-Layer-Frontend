// Scan calls used by the pages. Components call these, never fetch() directly.
import { env } from '../env';
import { api } from './client';
export type ReportResponse = NonNullable<Awaited<ReturnType<typeof getReport>>>;
export type Report = ReportResponse['report'];
export type Scan = ReportResponse['scan'];
export type Issue = Report['issues'][number];
export type BotAccess = Report['botAccess'][number];
export type ScannedPage = Report['pages'][number];
export type Area = Report['areas'][number]['area'];
export type Severity = Issue['severity'];
export type BusinessType = NonNullable<Report['businessTypes']>[number];
export type ScanDetails = { offer?: string; customers?: string; market?: string; keyPage?: string };

/** The backend's error message, so the seller sees why (e.g. "Enter a website address, like yourstore.com"). */
function errorMessage(error: unknown): string {
  const message = (error as { error?: { message?: string } } | undefined)?.error?.message;
  return message ?? 'Something went wrong. Please try again.';
}

/** `rescan` skips the one-hour reuse of a finished scan (the seller fixed things and wants a new score). */
export async function startScan(
  url: string,
  { rescan = false, businessTypes, details }: { rescan?: boolean; businessTypes?: BusinessType[]; details?: ScanDetails } = {},
): Promise<{ id: string } | { error: string }> {
  const { data, error } = await api.POST('/v1/scans', {
    body: { url, rescan, ...(businessTypes?.length && { businessTypes }), ...(details && Object.keys(details).length && { details }) },
  });
  return data ? { id: data.id } : { error: errorMessage(error) };
}

/** null when the scan doesn't exist. */
export async function getScan(id: string) {
  const { data, response } = await api.GET('/v1/scans/{id}', { params: { path: { id } }, cache: 'no-store' });
  if (response.status === 404 || response.status === 400) return null;
  if (!data) throw new Error(`Could not load scan (${response.status})`);
  return data;
}

export async function getReport(id: string) {
  const { data, response } = await api.GET('/v1/scans/{id}/report', { params: { path: { id } }, cache: 'no-store' });
  if (!data) throw new Error(`Could not load report (${response.status})`);
  return data;
}

/** The fix pack's files, snippets and steps. Null when the API refuses (owner check on, or scan not finished). */
export async function getFixPack(id: string) {
  const { data } = await api.GET('/v1/scans/{id}/fix-pack', { params: { path: { id } }, cache: 'no-store' });
  return data ?? null;
}
export type FixPack = NonNullable<Awaited<ReturnType<typeof getFixPack>>>;

/** A store's completed scans, newest first. Empty on error: history is a nice-to-have, never a reason to fail the page. */
export async function getSiteScans(siteId: string, limit = 20) {
  const { data } = await api.GET('/v1/sites/{id}/scans', { params: { path: { id: siteId }, query: { limit } }, cache: 'no-store' });
  return data ?? [];
}

/** Live progress stream (server-sent events). */
export const scanEventsUrl = (id: string) => `${env.apiUrl}/v1/scans/${id}/events`;

export type ScanStatus = Scan['status'];
