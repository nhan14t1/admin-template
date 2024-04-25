import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Select, Table, Tooltip } from "antd";
import { faExclamationCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../shared/contexts/AppContext";
import { deleteAPI, get } from "../../../shared/utils/apiUtils";
import { BASE_URL, CATEGORIES_POST, POST_STATUS, ROLES } from "../../../shared/constants/app-const";
import * as moment from 'moment'
import { deleteConfirm, successAlert, warningAlert } from "../../../shared/utils/alertUtils";
import styles from './PostManagement.module.scss';
import AuthContext from "../../../shared/contexts/AuthContext";
import { CLAIM_KEYS } from "../../../shared/constants/claim-const";
import { getUserInfo } from "../../../shared/utils/accountUtils";
import { QUERY_PARAMS } from "../../../shared/constants/url-const";
import { copyTextToClipboard } from "../../../shared/utils/commonUtils";

const PostManagement = () => {
  const defaultFilterObj = { userId: 0 };
  const { user, isSSR } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterObj, setFilterObj] = useState(Object.assign({}, defaultFilterObj));

  const columns = [
    {
      title: <>Lấy link sale&nbsp;
        <Tooltip title='Chắc năng này giúp bạn copy link bài viết để đi sale, sau khi khách hàng xem bài viết bằng link này và đặt tour ở trong bài viết thì lượt đặt đó sẽ được liên kết đến tài khoản của bạn'>
          <FontAwesomeIcon icon={faExclamationCircle} />
        </Tooltip></>,
      key: 'link-sale',
      render: (_, item) => {
        return <Button key={`btnSale${item.id}`} type="primary"
          size="small" onClick={e => onCopySaleLink(item.slug)} ghost>Copy</Button>
      }
    },
    {
      title: 'Tiêu đề (Click vào tiêu đề để xem)',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        if (item.status == POST_STATUS.Active.id) {
          return <Link href={`/article?id=${item.slug}`} target="_blank" className={styles.preview}>{title}</Link>
        }

        return <Link href={`/admin/post-management/preview?id=${item.slug}`} target="_blank" className={styles.preview}>{title}</Link>
      }
    },
    {
      title: 'Người đăng',
      key: 'author',
      render: (_, item) => {
        const name = `${item.userFirstName || ''} ${item.userLastName || ''}`.trim();
        return name || item.userEmail;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value, item) => {
        const statusObj = Object.values(POST_STATUS).find(_ => _.id == value) || {};
        return <span className={`badge ${value == POST_STATUS.Active.id ? 'bg-info' : 'bg-warning'} text-dark me-1`}>
          {statusObj.name || ''}</span>;
      }
    },
    {
      title: 'Categories',
      key: 'categories',
      render: (value, item) => {
        return (item.categories || []).map(c => (<span className={`badge ${c.id == CATEGORIES_POST.VietNam.id ? 'bg-info' : 'bg-warning'} text-dark me-1`}>{c.name}</span>))
      },
    },
    {
      title: 'Nhãn',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags, item) => {
        return (tags || []).map(c => (<span className={`badge bg-info text-dark me-1`}>{c.text}</span>));
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value, item) => {
        return value ? moment(value).format('DD/MM/YYYY HH:mm') : '';
      },
      sorter: (a, b) => a.createdDate - b.createdDate,
    },
    {
      title: 'Lên lịch',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
      render: (value, item) => {
        if (!value) {
          return ''
        }
        const dateStr = moment(value).format('DD/MM/YYYY HH:mm');
        return <span className={`${item.status == POST_STATUS.Schedule.id ? 'app-color text-bold' : 'text-line-through'}`}>{dateStr}</span>
      }
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      render: (_, item) => {
        return _ || 0;
      },
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: '',
      key: 'actions',
      render: (_, item) => {
        return <>
          <Link key={`lnkUpdate${item.id}`} href={`/admin/post-management/new-post?id=${item.id}`}>
            <Button key={`btnUpdate${item.id}`} type="primary" disabled={!isAdmin && userId != item.userId}>Sửa</Button> &nbsp;
          </Link>
          <Button key={`btnDelete${item.id}`} type="primary" danger className="mt-1"
            onClick={() => onDeleteClicked(item.id)} disabled={!isAdmin && userId != item.userId}>Xóa</Button>
        </>
      }
    },
  ];

  const { setLoading } = useContext(AppContext);
  useEffect(() => {
    getUsers();
    getData();
  }, []);

  useEffect(() => {
    if (!isSSR) {
      setUserId(user?.[CLAIM_KEYS.userId]);
      setIsAdmin(user?.[CLAIM_KEYS.role]?.includes(ROLES.Admin.name));
    }
  }, [isSSR]);

  const getData = () => {
    setLoading(true);
    get('/admin/post', false)
      .then(res => {
        if (res && res.data) {
          setData(res.data);
        }
      }).finally(() => setLoading(false));
  }

  const getUsers = () => {
    get('/admin/account/active', false)
      .then(res => {
        if (res && res.data) {
          setUsers(res.data);
        }
      });
  }

  const onDeleteClicked = (id) => {
    deleteConfirm('Xóa bài viết', 'Bạn có chắc?', result => {
      result && onDeletePost(id);
    });
  }

  const onDeletePost = (id) => {
    setLoading(true);

    deleteAPI(`/admin/post/${id}`, false)
      .then(res => {
        if (res && res.data) {
          const index = data.findIndex(_ => _.id == id);
          if (index > -1) {
            data.splice(index, 1);
            setData([...data]);
          }

          successAlert('Xóa thành công');
        }
      }).finally(() => setLoading(false));
  }

  const onCopySaleLink = (slug) => {
    const userInfo = getUserInfo();
    const refCode = userInfo?.refCode;
    if (!refCode) {
      warningAlert('Bạn chưa có ref code để thực hiện chức năng sale, hãy thử đăng xuất và đăng nhập lại hoặc liên hệ admin', 5000);
      return;
    }

    const link = `${BASE_URL}/article?id=${slug}&${QUERY_PARAMS.saleCode}=${refCode.toLocaleLowerCase()}`;
    copyTextToClipboard(link);
    successAlert('Đã copy link', 1000);
  }

  const getDataSource = () => {
    const { userId } = filterObj;
    if (!userId) {
      return data;
    }

    return data.filter(_ => _.userId == userId);
  }

  const dataSource = getDataSource();

  return <>
    <Card>
      <h2>Quản lý bài viết</h2>
      <br />

      <div className="d-flex">
        <Link href="/admin/post-management/new-post">
          <Button type="primary">
            <><FontAwesomeIcon icon={faPlus} />&nbsp; Bài viết mới</>
          </Button>
        </Link>

        <div className="d-flex align-items-center ms-auto">
          <div className="me-4">
            Tác giả:&nbsp;&nbsp;
            <Select key='drUsers' value={filterObj.userId} onChange={e => setFilterObj({ ...filterObj, userId: e })}
              style={{ minWidth: 160 }}>
              <Select.Option key={`drU0`} value={0}>Tất cả</Select.Option>
              {users.map(user => <Select.Option key={`drU${user.id}`} value={user.id}>
                {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                { user.id == userId && ' (You)'}
              </Select.Option>)}
            </Select>
          </div>

          <div>
            Tổng:&nbsp;
            <b>{dataSource.length}</b> bài viết
          </div>
        </div>
      </div>

      <Table dataSource={dataSource} columns={columns} className="mt-2" />
    </Card>
  </>;
}

export default PostManagement;