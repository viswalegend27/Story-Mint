import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
<Html lang="en">
  <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet"/>
  </Head>
  <body>
      <Main />
      <NextScript />
  </body>
</Html>
  )
}