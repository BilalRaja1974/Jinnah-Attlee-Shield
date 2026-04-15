import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Jinnah-Attlee Shield',
  description: 'Pakistan vs England · Annual Golf Tournament',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'JAS Golf' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F6E56',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8f8f6', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
