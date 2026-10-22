// Scan calls used by the pages. Components call these, never fetch() directly.
import { env } from '../env';
import { api } from './client';
export type ReportResponse = NonNullable<Awaited<ReturnType<typeof getReport>>>;
export type Report = ReportResponse['report'];
export type Scan = ReportResponse['scan'];
export type Issue = Report['issues'][number];

/** The backend's error message, so the seller sees why (e.g. "Enter a website address, like yourstore.com"). */
function errorMessage(error: unknown): string {
  const message = (error as { error?: { message?: string } } | undefined)?.error?.message;
  return message ?? 'Something went wrong. Please try again.';
}

export async function startScan(url: string): Promise<{ id: string } | { error: string }> {
  const { data, error } = await api.POST('/v1/scans', { body: { url } });
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

/** Live progress stream (server-sent events). */
export const scanEventsUrl = (id: string) => `${env.apiUrl}/v1/scans/${id}/events`;

export type ScanStatus = Scan['status'];
