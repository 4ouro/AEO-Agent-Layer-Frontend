import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { MessagePage } from '@/components/layout/message-page';
import { ButtonLink } from '@/components/ui/button';
import { ReportView } from '@/features/report';
import { ScanProgress } from '@/features/scan';
import { getReport, getScan, getSiteScans } from '@/lib/api/scans';

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

// The scan id is only known at request time, so the data read sits inside Suspense (Cache Components rule).
export default function ScanPage({ params }: PageProps<'/scans/[id]'>) {
  return (
    <Suspense fallback={<main className="min-h-dvh flex-1 bg-canvas" />}>
      <ScanContent params={params} />
    </Suspense>
  );
}

async function ScanContent({ params }: { params: PageProps<'/scans/[id]'>['params'] }) {
  await connection(); // scan data is live: always render at request time, never prerender
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) notFound();
  const domain = domainOf(scan.url);

  if (scan.status === 'completed') {
    const [{ report }, history] = await Promise.all([getReport(id), getSiteScans(scan.siteId)]);
    return <ReportView report={report} scan={scan} history={history} domain={domain} />;
  }

  if (scan.status === 'failed') {
    return (
      <MessagePage kicker={domain} title="We could not scan this site." detail={scan.error}>
        <ButtonLink href="/">Try another site</ButtonLink>
      </MessagePage>
    );
  }

  return <ScanProgress scanId={id} domain={domain} />;
}
