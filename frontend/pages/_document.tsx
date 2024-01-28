import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-XBGDC7K6PM"></script>
          <script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XBGDC7K6PM');
    `,
  }}
/>

          {/* Basic meta tags */}
          <meta name="title" content="Hunnys Closet" />
          <meta name="description" content="Unleash Your Creativity with Hunnys Closet, the ultimate Digital Dress-up Doll Experience" />
          <meta name="keywords" content="nft, ethereum, Hunnys, Dolls, art, fashion" />

          {/* Open Graph tags */}
          <meta property="og:title" content="Hunnys Closet" />
          <meta property="og:description" content="Unleash Your Creativity with Hunnys Closet, the ultimate Digital Dress-up Doll Experience" />
          <meta property="og:image" content="https://hunnys.io/wp-content/uploads/2023/09/Hunnys-Closet-600x400-1.png" />
          <meta property="og:url" content="https://closet.hunnys.io" />

          {/* Twitter tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Hunnys Closet" />
          <meta name="twitter:description" content="Unleash Your Creativity with Hunnys Closet, the ultimate Digital Dress-up Doll Experience" />
          <meta name="twitter:image" content="https://hunnys.io/wp-content/uploads/2023/09/Hunnys-Closet-600x400-1.png" />

          {/* Favicon */}
          <link rel="icon" href="https://hunnys.io/wp-content/uploads/2023/08/HunnysLogo.svg" />
          
          {/* Other global head elements */}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Adding the chatbase script */}
          <script
  dangerouslySetInnerHTML={{
    __html: `
      window.chatbaseConfig = {
        chatbotId: "X0YcQ2m306g14blZMCQzS",
      }
    `,
  }}
/>
<script src="https://www.chatbase.co/embed.min.js" id="X0YcQ2m306g14blZMCQzS" defer />
        </body>
      </Html>
    )
  }
}

export default MyDocument
