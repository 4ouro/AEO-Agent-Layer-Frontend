import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { Logo } from '@/components/layout/logo';
import { MessagePage } from '@/components/layout/message-page';
import { ButtonLink } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Panel } from '@/components/ui/panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFixPack, getScan } from '@/lib/api/scans';

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');
const pathOf = (url: string) => new URL(url).pathname;

const scriptTag = (jsonLd: unknown) => `<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;

const tabClass =
  'h-auto flex-none rounded-none px-4 py-3 text-base font-normal text-muted after:bottom-0 after:bg-moss hover:text-forest data-[state=active]:font-semibold data-[state=active]:text-forest';

// Request-time data sits inside Suspense (Cache Components rule), like the report page.
export default function FixPackPage({ params }: PageProps<'/scans/[id]/fix-pack'>) {
  return (
    <Suspense fallback={<main className="min-h-dvh flex-1 bg-canvas" />}>
      <FixPackContent params={params} />
    </Suspense>
  );
}

async function FixPackContent({ params }: { params: PageProps<'/scans/[id]/fix-pack'>['params'] }) {
  await connection();
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) notFound();
  const domain = domainOf(scan.url);
  const pack = await getFixPack(id);

  if (!pack) {
    return (
      <MessagePage kicker={domain} title="The fix pack is not available yet." detail="It is ready when the scan finishes.">
        <ButtonLink href={`/scans/${id}`}>Back to the report</ButtonLink>
      </MessagePage>
    );
  }

  const snippets = [
    ...pack.schemas.map((s) => ({ key: `${s.type}-${s.url}`, title: `${s.type} schema`, url: s.url, code: scriptTag(s.jsonLd) })),
    ...pack.productSchemas.map((s) => ({ key: `product-${s.url}`, title: 'Product schema', url: s.url, code: scriptTag(s.jsonLd) })),
  ];

  const tabs = [
    ...(pack.files.length > 0 ? [{ value: 'files', label: 'Files' }] : []),
    ...(snippets.length > 0 ? [{ value: 'schemas', label: 'Schema snippets' }] : []),
    ...(pack.sellerSteps.length > 0 ? [{ value: 'steps', label: 'Your steps' }] : []),
  ];

  return (
    <main className="flex min-h-dvh flex-1 flex-col gap-6 bg-canvas px-4 py-6 md:px-8 md:py-8 xl:px-10">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <h1 className="font-serif text-4xl font-medium tracking-[-0.02em] md:text-5xl">Fix pack for {domain}</h1>
        </div>
        <ButtonLink href={`/scans/${id}`} variant="outline">
          Back to the report
        </ButtonLink>
      </header>

      {pack.files.length === 0 && snippets.length === 0 && pack.sellerSteps.length === 0 && (
        <p className="text-lg text-muted">Nothing to add. This site already has what AI needs.</p>
      )}

      {tabs.length > 0 && (
      <Tabs defaultValue={tabs[0]?.value}>
        <TabsList variant="line" className="h-auto w-full justify-start gap-2 border-b border-line pb-0">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className={tabClass}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {pack.files.length > 0 && (
          <TabsContent value="files" className="pt-6">
      <div className="grid gap-6 xl:grid-cols-2">
        {pack.files.map((file) => (
          <Panel key={file.path} label={file.path}>
            <p className="text-base">{file.why}</p>
            {file.install.length > 0 && (
              <ol className="flex list-decimal flex-col gap-2 pl-6 text-base text-muted">
                {file.install.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
            <CopyButton text={file.content} />
            <pre className="max-h-96 overflow-auto rounded-xl border border-line bg-canvas p-4 text-base whitespace-pre-wrap">{file.content}</pre>
          </Panel>
        ))}

      </div>
          </TabsContent>
        )}
        {snippets.length > 0 && (
          <TabsContent value="schemas" className="pt-6">
      <div className="grid gap-6 xl:grid-cols-2">
        {snippets.map((s) => (
          <Panel key={s.key} label={s.title}>
            <p className="text-base text-muted">Paste into the page head of {pathOf(s.url)}</p>
            <CopyButton text={s.code} />
            <pre className="max-h-96 overflow-auto rounded-xl border border-line bg-canvas p-4 text-base whitespace-pre-wrap">{s.code}</pre>
          </Panel>
        ))}

      </div>
          </TabsContent>
        )}
        {pack.sellerSteps.length > 0 && (
          <TabsContent value="steps" className="pt-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel label="Your steps">
            <ul className="flex flex-col divide-y divide-line">
              {pack.sellerSteps.map((s) => (
                <li key={s.checkId} className="flex flex-col gap-2 py-4 first:pt-0">
                  <span className="text-base font-semibold">{s.title}</span>
                  <ol className="flex list-decimal flex-col gap-1 pl-6 text-base text-muted">
                    {s.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </Panel>
      </div>
          </TabsContent>
        )}
      </Tabs>
      )}
    </main>
  );
}
