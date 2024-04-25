"use client"
import Link from 'next/link';
import { AdminContext } from '../../../shared/contexts/AdminContext';
import { useContext, useEffect, useState } from 'react';
import { ROLES } from '../../../shared/constants/app-const';
import { useRouter } from 'next/router';
import AuthContext from '../../../shared/contexts/AuthContext';
import AppContext from '../../../shared/contexts/AppContext';
import AppLoading from '../../shared/AppLoading';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faNewspaper, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminSidebar.module.scss';
import { CLAIM_KEYS } from '../../../shared/constants/claim-const';
import AccountDropdown from '../components/account-dropdown/AccountDropdown';

const { Content, Sider } = Layout;
const MENU_ITEMS = {
  post: {
    key: 'post',
    href: '/admin/post-management'
  },
  user: {
    key: 'user',
    href: '/admin/user-management'
  },
}

const AdminSidebar = ({ sidebarOpen, children }) => {
  const router = useRouter();
  const { user, isSSR } = useContext(AuthContext);
  const { loading } = useContext(AppContext);
  const [admin, setAdmin] = useState(false);

  const isAdminOrEditor = () => {
    return user && (
      user[CLAIM_KEYS.role]?.includes(ROLES.Admin.name)
      || user[CLAIM_KEYS.role]?.includes(ROLES.Editor.name)
    );
  }

  const isAdmin = () => {
    return user && user[CLAIM_KEYS.role]?.includes(ROLES.Admin.name);
  }

  const [selectedKey, setSelectedKey] = useState(MENU_ITEMS.post.key);

  useEffect(() => {
    if (!isSSR) {
      if (!isAdminOrEditor()) {
        // router.push('/admin/login');
        // return;
      }

      // setAdmin(isAdmin());
      setAdmin(true);
    }
  }, [isSSR]);

  const activeMenuItem = () => {
    const url = location.href.toLowerCase();
    const item = Object.values(MENU_ITEMS).reverse().find(_ => url.includes(_.href)) || MENU_ITEMS.post;
    setSelectedKey(item.key);
  }

  useEffect(() => {
    activeMenuItem();
  }, [])

  return (
    <AdminContext.Provider value={{ sidebarOpen }}>
      <Layout className={styles.admin_sidebar}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link href={'/'}>
              <img src='/assets/logo.svg' height={40} />
            </Link>
          </div>

          <div className='d-flex mb-3'>
            <div className='m-auto'>
              <AccountDropdown user={user} />
            </div>
          </div>

          <Menu theme="dark" className={styles.menu} selectedKeys={[selectedKey]}
            onSelect={({ key }) => setSelectedKey(key)}>
            <Menu.Item key={MENU_ITEMS.post.key}>
              <FontAwesomeIcon icon={faNewspaper} />
              <Link href={MENU_ITEMS.post.href}>Bài viết</Link>
            </Menu.Item>

            {admin &&
              <Menu.Item key={MENU_ITEMS.user.key}>
                <FontAwesomeIcon icon={faUser} />
                <Link href={MENU_ITEMS.user.href}>Người dùng</Link>
              </Menu.Item>
            }
          </Menu>
        </Sider>

        <Layout>
          <Content>
            {children}
          </Content>
        </Layout>
      </Layout>
      <AppLoading loading={loading}></AppLoading>
    </AdminContext.Provider>
  );
}
export default AdminSidebar;