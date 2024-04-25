import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Table, Typography } from "antd";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../shared/contexts/AppContext";
import { deleteAPI, get, put } from "../../../shared/utils/apiUtils";
import { ROLES } from "../../../shared/constants/app-const";
import * as moment from 'moment'
import { deleteConfirm, successAlert } from "../../../shared/utils/alertUtils";
import UserModal from "./UserModal";

const UserManagement = () => {
  const userModalRef = useRef();
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên',
      key: 'name',
      render: (_, item) => {
        const name = `${item.firstName || ''} ${item.lastName || ''}`.trim();
        return name || item.email;
      }
    },
    {
      title: 'Chức vụ',
      dataIndex: 'roleIds',
      key: 'roleIds',
      render: (value, item) => {
        return (item.roleIds || [])
          .map(id => {
            const role = Object.values(ROLES).find(_ => _.id == id)
            return <span className={`badge ${role.id == ROLES.Admin.id ? 'bg-success' : 'bg-info'} text-dark me-1`}>{role.name}</span>
          });
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value, item) => {
        return <Typography.Text type={value ? 'success' : 'warning'}>{value ? 'Hoạt động' : 'Đã hủy'}</Typography.Text>
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value, item) => {
        return value ? moment(value).format('DD/MM/YYYY HH:mm') : '';
      }
    },
    {
      title: '',
      key: 'actions',
      render: (_, item) => {
        return <>
          <Button key={`btnUpdate${item.id}`} type="primary" size="small"
            onClick={() => userModalRef.current.showModal(item)}>Sửa</Button> &nbsp;
          {item.isActive &&
            <Button key={`btnDelete${item.id}`} type="primary" danger className="mt-1"
              onClick={() => onDeactivateClicked(item.id)} size="small">Hủy</Button>
          }

          {!item.isActive &&
            <Button key={`btnActivate${item.id}`} type="primary" ghost className="mt-1"
              onClick={() => onActivateClicked(item.id)} size="small">Kích hoạt</Button>
          }
        </>
      }
    },
  ];

  const { setLoading } = useContext(AppContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    get('/admin/account', false)
      .then(res => {
        if (res && res.data) {
          setData(res.data);
        }
      }).finally(() => setLoading(false));
  }

  const onDeactivateClicked = (id) => {
    deleteConfirm('Hủy người dùng', 'Bạn có muốn hủy người dùng này?', result => {
      result && onDeactivate(id);
    });
  }

  const onDeactivate = (id) => {
    setLoading(true);

    deleteAPI(`/admin/account/${id}`, false)
      .then(res => {
        if (res && res.data) {
          const user = data.find(_ => _.id == id);
          user.isActive = false;
          setData([...data]);

          successAlert(`Đã hủy tài khoản ${user.email}`);
        }
      }).finally(() => setLoading(false));
  }
  
  const onActivateClicked = (id) => {
    deleteConfirm('Kích hoạt người dùng', 'Bạn có muốn kích hoạt người dùng này?', result => {
      result && onActivate(id);
    });
  }

  const onActivate = (id) => {
    setLoading(true);

    put(`/admin/account/activate/${id}`, false)
      .then(res => {
        if (res && res.data) {
          const user = data.find(_ => _.id == id);
          user.isActive = true;
          setData([...data]);

          successAlert(`Đã kích hoạt ${user.email}`);
        }
      }).finally(() => setLoading(false));
  }

  const onUserUpdated = user => {
    const index = data.findIndex(_ => _.id == user.id);

    if (index > -1) {
      data[index] = user;
      setData([...data]);
    }
  }

  return <>
    <Card>
      <h2>Quản lý người dùng</h2>
      <br />

      <div className="d-flex">
        <Button type="primary" className="ms-auto" onClick={() => userModalRef.current.showModal()}>
          <><FontAwesomeIcon icon={faPlus} />&nbsp; Tạo người dùng</>
        </Button>
      </div>

      <Table dataSource={data} columns={columns} className="mt-2" />
      <UserModal ref={userModalRef} onCreated={user => setData([user, ...data])}
        onUpdated={onUserUpdated} />
    </Card>
  </>;
}

export default UserManagement;