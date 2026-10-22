import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { ReportView } from '@/features/report';
import { ScanProgress } from '@/features/scan';
import { getReport, getScan } from '@/lib/api/scans';

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

// The scan id is only known at request time, so the data read sits inside Suspense (Cache Components rule).
export default function ScanPage({ params }: PageProps<'/scans/[id]'>) {
  return (
    <Suspense fallback={<main className="grid min-h-dvh flex-1 lg:grid-cols-[2fr_3fr]"><section className="bg-forest" /></main>}>
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
    const { report } = await getReport(id);
    return <ReportView report={report} domain={domain} />;
  }

  if (scan.status === 'failed') {
    return (
      <main className="flex min-h-dvh flex-1 flex-col justify-center gap-10 bg-forest px-6 text-white md:px-16">
        <span className="text-3xl font-bold break-all text-sprout">{domain}</span>
        <h1 className="text-6xl leading-none font-extrabold md:text-8xl">We could not scan this store.</h1>
        {scan.error && <p className="text-2xl text-sprout">{scan.error}</p>}
        <ButtonLink href="/" variant="light" className="self-start">
          Try again
        </ButtonLink>
      </main>
    );
  }

  return <ScanProgress scanId={id} domain={domain} />;
}
