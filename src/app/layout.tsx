import type { Metadata, Viewport } from 'next';
import '@/client/index.css';

export const metadata: Metadata = {
  title: 'Vonatinfó',
  description:
    'Magyarországi vasúti járatok élő követése térképen: pozíció, késés, megállók és szolgáltatások.',
  icons: { icon: '/mav-g-misi.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0057be' },
    { media: '(prefers-color-scheme: dark)', color: '#14181f' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
