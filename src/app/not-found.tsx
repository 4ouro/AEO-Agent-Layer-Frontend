import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col justify-center gap-10 bg-forest px-6 text-white md:px-16">
      <h1 className="text-6xl leading-none font-extrabold md:text-8xl">This page does not exist.</h1>
      <ButtonLink href="/" variant="light" className="self-start">
        Scan a store
      </ButtonLink>
    </main>
  );
}
