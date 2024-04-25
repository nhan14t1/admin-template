import { Button, Input, Modal, Select, Typography } from "antd";
import { forwardRef, useImperativeHandle, useState, useContext } from "react";
import { post, put } from "../../../shared/utils/apiUtils";
import { errorAlert, successAlert } from "../../../shared/utils/alertUtils";
import AppContext from "../../../shared/contexts/AppContext";
import { ROLES } from "../../../shared/constants/app-const";

const UserModal = ({ onCreated, onUpdated }, ref) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const { setLoading } = useContext(AppContext);
  const isEdit = user && user.id;

  const getTitle = () => {
    if (!isEdit) {
      return "Tạo người dùng";
    }

    return `Chỉnh sửa người dùng - ${user.email}`;
  }

  const validateData = () => {
    if (!user.email?.trim()) {
      errorAlert('Vui lòng nhập email');
      return false;
    }

    if (!isEdit && !user.password?.trim()) {
      errorAlert('Vui lòng nhập mật khẩu');
      return false;
    }

    if (!user.roleIds || !user.roleIds.length) {
      errorAlert('Vui lòng chọn một chức vụ');
      return false;
    }

    if (!user.firstName?.trim()) {
      errorAlert('Vui lòng nhập tên');
      return false;
    }

    return true;
  }

  const onCreate = () => {
    setLoading(true);

    post('/admin/account', user)
      .then(res => {
        if (res && res.data) {
          successAlert(`Đã tạo người dùng ${res.data.email}`);
          onCreated(res.data);
          setOpen(false);
        }
      }).finally(() => setLoading(false));
  }

  const onUpdate = () => {
    setLoading(true);

    put('/admin/account', user)
      .then(res => {
        if (res && res.data) {
          successAlert(`Đã cập nhật người dùng ${res.data.email}`);
          onUpdated(res.data);
          setOpen(false);
        }
      }).finally(() => setLoading(false));
  }

  const onCreateClicked = () => {
    if (!validateData()) {
      return;
    }

    !isEdit ? onCreate() : onUpdate();
  }

  useImperativeHandle(ref, () => ({
    showModal(updateUser) {
      setUser(Object.assign({}, updateUser || {}));
      setOpen(true);
    }
  }));

  const roleOptions = Object.values(ROLES).map(_ => ({ value: _.id, label: _.name }));

  return <Modal title={getTitle} open={open}
    footer={false} closeIcon={false} closable={false}>

    <b className='d-block'>Email:</b>
    <div className='mt-2'>
      <Input key='email' className='w-100' placeholder='example@example.com'
        value={user.email}
        disabled={isEdit}
        onChange={e => setUser({ ...user, email: e.target.value })} ></Input>
    </div>

    <b className='mt-3 d-block'>Mật khẩu:
      {isEdit && <Typography.Text type="secondary">(Nhập mật khẩu nếu muốn đổi mật khẩu)</Typography.Text>
      }
    </b>
    <div className='mt-2'>
      <Input key='pass' className='w-100' placeholder='12304560'
        value={user.password}
        onChange={e => setUser({ ...user, password: e.target.value })} ></Input>
    </div>

    <b className='mt-3 d-block'>Chức vụ:</b>
    <div className='mt-2'>
      <Select
        key='role'
        className="w-100"
        mode="multiple"
        allowClear
        placeholder="Chọn chức vụ"
        value={user.roleIds}
        onChange={(e) => setUser({ ...user, roleIds: e })}
        options={roleOptions}
      />
    </div>

    <b className='mt-3 d-block'>Tên:</b>
    <div className='row mt-2'>
      <div className="col-6">
        <Input key='firstName' className='w-100' placeholder='Tên'
          value={user.firstName}
          onChange={e => setUser({ ...user, firstName: e.target.value })}></Input>
      </div>

      <div className="col-6">
        <Input key='lastName' className='w-100' placeholder='Họ và tên đệm'
          value={user.lastName}
          onChange={e => setUser({ ...user, lastName: e.target.value })}></Input>
      </div>
    </div>

    <b className='mt-3 d-block'>Số điện thoại:</b>
    <div className='mt-2'>
      <Input key='phoneNumber' className='w-100' placeholder='Nhập số điện thoại'
        value={user.phoneNumber}
        onChange={e => setUser({ ...user, phoneNumber: e.target.value })}></Input>
    </div>

    <div className='mt-4 d-flex'>
      <div className='ms-auto'>
        <Button key='btn-cancel' type='default' onClick={() => setOpen(false)}>Hủy</Button>
        <Button key='btn-create' className='ms-2' type='primary'
          onClick={() => onCreateClicked()}>{isEdit ? 'Lưu' : 'Tạo'}</Button>
      </div>
    </div>
  </Modal>
}

export default forwardRef(UserModal);