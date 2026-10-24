'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { startScan, type BusinessType, type ScanDetails } from '@/lib/api/scans';

const TYPES: { value: BusinessType; label: string }[] = [
  { value: 'store', label: 'Store' },
  { value: 'software', label: 'Software' },
  { value: 'services', label: 'Services' },
  { value: 'local', label: 'Local business' },
  { value: 'publisher', label: 'Publisher' },
  { value: 'other', label: 'Other' },
];
const MAX_TYPES = 3;
const NOT_SURE = 'none';

const DETAIL_FIELDS: { key: keyof ScanDetails; label: string }[] = [
  { key: 'offer', label: 'What you offer' },
  { key: 'customers', label: 'Who your customers are' },
  { key: 'market', label: 'Where you serve' },
  { key: 'keyPage', label: 'Main page (pricing or services)' },
];

const optionClass =
  'h-auto min-w-0 rounded-full border border-line bg-transparent px-4 py-1.5 text-base font-normal text-forest transition-[background-color,border-color,color,transform] duration-150 hover:border-moss hover:bg-transparent hover:text-forest active:scale-[0.97] data-[state=on]:border-moss data-[state=on]:bg-moss data-[state=on]:font-semibold data-[state=on]:text-white data-[state=on]:hover:bg-moss data-[state=on]:hover:text-white';

/** One search-style field (address + Scan), then the business type and optional details. */
export function ScanForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [types, setTypes] = useState<BusinessType[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<ScanDetails>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // "Not sure" is exclusive: picking it clears the rest, picking anything else drops it.
  function onTypesChange(next: string[]) {
    if (next.includes(NOT_SURE) && types.length > 0) return setTypes([]);
    setTypes(next.filter((v): v is BusinessType => v !== NOT_SURE).slice(0, MAX_TYPES));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const filled = Object.fromEntries(Object.entries(details).filter(([, v]) => v?.trim()).map(([k, v]) => [k, v!.trim()])) as ScanDetails;
    const result = await startScan(url, { businessTypes: types, details: filled });
    if ('error' in result) {
      setError(result.error);
      setPending(false);
      return;
    }
    router.push(`/scans/${result.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex h-16 items-center gap-2 rounded-full border border-line bg-canvas p-1.5 pl-6 transition-[border-color,background-color] duration-150 focus-within:border-moss focus-within:bg-white">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          aria-label="Website address"
          aria-invalid={error ? true : undefined}
          required
          autoFocus
          className="h-full flex-1 rounded-none border-0 bg-transparent px-0 text-xl text-forest placeholder:text-muted focus-visible:bg-transparent"
        />
        <Button type="submit" disabled={pending} className="h-full px-8">
          {pending ? 'Starting' : 'Scan'}
        </Button>
      </div>

      <ToggleGroup
        type="multiple"
        spacing={2}
        aria-label="Business type"
        value={types.length === 0 ? [NOT_SURE] : types}
        onValueChange={onTypesChange}
        className="flex-wrap"
      >
        <ToggleGroupItem value={NOT_SURE} className={optionClass}>
          Not sure
        </ToggleGroupItem>
        {TYPES.map((t) => (
          <ToggleGroupItem key={t.value} value={t.value} className={optionClass}>
            {t.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleTrigger className="text-base font-semibold text-moss underline-offset-4 hover:underline">
          {showDetails ? 'Hide details' : 'Add details'}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {DETAIL_FIELDS.map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <Label htmlFor={`detail-${f.key}`} className="sr-only">
                  {f.label}
                </Label>
                <Input
                  id={`detail-${f.key}`}
                  value={details[f.key] ?? ''}
                  onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.label}
                />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {error && (
        <p role="alert" className="pl-6 text-base text-red">
          {error}
        </p>
      )}
    </form>
  );
}
