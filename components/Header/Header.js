import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { CATEGORIES_POST, WEB_NAME } from '../../shared/constants/app-const';

function Header(props) {
  return (
    <nav>
      <div className="navbar">
        <FontAwesomeIcon icon={faBars} className='bx-menu' />
        <div className="logo"><Link href='/'>
          <img src='/assets/logo.svg' alt={`${WEB_NAME} logo`} height={36}/>  
        </Link></div>
        <div className="nav-links">
          <div className="sidebar-logo">
            <span className="logo-name">yoursite</span>
            <FontAwesomeIcon icon={faXmark} className='btn-close-menu text-light' />
          </div>
          <ul className="links ps-0">
            
          </ul>
        </div>
        {/* <div className="search-box">
          <span className='bx-search'>
            <FontAwesomeIcon icon={faMagnifyingGlass} className='cursor-pointer'/>
            <FontAwesomeIcon icon={faXmark} className='cursor-pointer'/>
          </span>
          
          <div className="input-box">
            <input type="text" placeholder="Search..." />
          </div>
        </div> */}
      </div>
    </nav>
  );
}

export default Header;
