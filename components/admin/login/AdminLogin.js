import { useState } from 'react';
import styles from './AdminLogin.module.scss';
import Head from 'next/head';
import { post } from '../../../shared/utils/apiUtils';
import { saveInfo } from '../../../shared/utils/accountUtils';
import { useRouter } from 'next/router';
import { WEB_NAME } from '../../../shared/constants/app-const';

const AdminLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onLogin = () => {
    post('/Account/Login', { userName, password }, false)
      .then(res => {
        if (res && res.data) {
          saveInfo(res.data);
          // router.push('/admin/post-management');
          window.location.href = '/admin/post-management';
        }
      })
  }

  return (
    <div className={styles['account-page']}>
      <Head>
        <title>{`${WEB_NAME} - Admin Login`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="/assets/css/admin-login.css"></link>
      </Head>

      <div className="login-page">
        <div className="form">
          <div className="login-form">
            <input type="text" placeholder="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={e => e.keyCode == 13 && onLogin()} />
            <button type='button' onClick={() => onLogin()}>login</button>
            {/* <p className="message">Not registered? <a href="/register">Create an account</a></p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;