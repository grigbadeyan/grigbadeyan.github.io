import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tsghotner | Ծղոտներ | Цхотнер - Sauna Hotel Complex Yerevan',
  description: 'Tsghotner sauna-hotel complex in the heart of Yerevan. Eastern, Russian and Finnish baths, pools, jacuzzi, restaurant and comfortable suites.',
  keywords: 'tsghotner, sauna, hotel, yerevan, armenia, bath, spa, tsxotner',
  openGraph: {
    title: 'Tsghotner Sauna-Hotel Complex',
    description: 'Unforgettable recreation in the heart of Yerevan',
    type: 'website',
    locale: 'hy_AM',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600&family=Noto+Serif+Armenian:wght@300;400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
