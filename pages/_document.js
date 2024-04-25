import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='vi'>
        <Head>
          <link rel='icon' href='/favicon.svg' />
          <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
          <meta property="og:type" content="article" />
          <meta property="og:locale" content="vi_VN" />
          <meta property="fb:app_id" content="25813757698223161" />
          <link rel="stylesheet" href="/assets/navbar/style.css" />
          <script type="text/javascript" src="/assets/navbar/script.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
