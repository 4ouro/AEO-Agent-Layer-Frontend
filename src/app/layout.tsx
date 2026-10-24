import type { Metadata } from 'next';
import { Lora, Nunito } from 'next/font/google';
import './globals.css';

// Nunito for everything; Lora (serif) only for the big headings.
const nunito = Nunito({ variable: '--font-nunito', subsets: ['latin'] });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgentLayer',
  description: 'See your site the way AI does.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${nunito.variable} ${lora.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Before first paint: allow data animations only if someone is looking (see globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "if(document.visibilityState==='visible')document.documentElement.dataset.motion=''" }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
