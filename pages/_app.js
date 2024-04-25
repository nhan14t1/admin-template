import '@fortawesome/fontawesome-svg-core/styles.css';
import 'nprogress/nprogress.css';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/globals.scss';
import '../styles/app-content.scss';
import '../styles/app-box.scss';
import '../styles/admin/new-post.scss';
import '../styles/scrollbar.scss';
import '../styles/admin/thumbnail-upload.scss';
import '../styles/reset/_variables.bootstrap.scss';
import '../styles/reset.scss';
import Layout from '../components/Layout/Layout';

import Router from 'next/router';
import NProgress from 'nprogress';

// NProgress Customization
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

// Show a loading bar when changing routes
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return getLayout(
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
