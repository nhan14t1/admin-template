import {
  Header,
  Footer,
} from '../index';
import styles from './Layout.module.scss';

function Layout({ children }) {

  return (
    <div className='content'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
