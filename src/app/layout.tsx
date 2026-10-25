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
  // A sötét témához tartozó színt a kliens állítja át (useColorScheme.ts).
  themeColor: '#0057be',
};

// Az első festés előtt beállítja a témát, hogy ne villanjon fel a világos oldal.
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem('theme');var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
