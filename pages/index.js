import Head from 'next/head';
import {
  ScrollToTop,
} from '../components';
import { WEB_NAME } from '../shared/constants/app-const';

function Home() {
  return (
    <div>
      <Head>
        <title>{`${WEB_NAME} - Trang chủ`}</title>
        <link rel="canonical" href="https://yoursite.com" />
        <meta property="og:title" content="Your Site" />
        <meta property="og:image" content="https://yoursite.com/assets/images/fb_preview.png" />
        <meta property="og:description" content="wqe qwewqe " />
        <meta property="og:url" content="https://yoursite.com" />
        <meta name="description" content="qwe wqeqw" />
      </Head>

      Hellow world
      <ScrollToTop />
    </div>
  );
}

export default Home;
