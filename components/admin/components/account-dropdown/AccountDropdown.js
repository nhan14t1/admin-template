import { Dropdown, Space } from "antd";
import styles from './AccountDropdown.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getUserInfo, removeStoreLoggedUser } from "../../../../shared/utils/accountUtils";
import ChangePassModal from "../change-pass-modal/ChangePassModal";
import { infoConfirm } from "../../../../shared/utils/alertUtils";
import { post } from "../../../../shared/utils/apiUtils";
import { useRouter } from 'next/router'

const AccountDropdown = () => {
  const [userInfo, setUserInfo] = useState({});
  const [passModalOpen, setPassModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  const ITEMS = {
    CHANGE_PASS: {
      key: '1',
      label: (
        <div>Đổi mật khẩu</div>
      ),
    },
    LOGOUT: {
      key: '2',
      label: (
        <div>Đăng xuất</div>
      ),
    },
  };

  const items = Object.values(ITEMS);

  const onItemClicked = ({ key }) => {
    switch (key) {
      case ITEMS.CHANGE_PASS.key:
        return setPassModalOpen(true);
      case ITEMS.LOGOUT.key:
        return logout();
    }
  }

  const logout = () => {
    infoConfirm('Đăng xuất', 'Bạn có muốn đăng xuất?', (result) => {
      if (result) {
        post('/account/logout', null, false)
          .then(res => {
            removeStoreLoggedUser();
            router.push('/');
          });
      }
    });
  }

  const getFirstName = () => {
    return userInfo?.firstName || userInfo?.email || 'Tài khoản';
  }

  return <>
    <Dropdown menu={{ items, onClick: onItemClicked }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <span className={styles.first_name}>
            <span className={styles.label}>{getFirstName()}</span>
            <FontAwesomeIcon icon={faCaretDown} className={styles.icon} />
          </span>
        </Space>
      </a>
    </Dropdown>

    <ChangePassModal open={passModalOpen} onClose={() => setPassModalOpen(false)}/>
  </>
}

export default AccountDropdown;