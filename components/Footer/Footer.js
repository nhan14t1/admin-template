import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Footer.module.scss';
import Link from 'next/link';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <p className='text-center mb-0'>@ 2024 yoursite - Kinh nghiệm du lịch</p>
      </div>
    </footer>
  );
}

export default Footer;
