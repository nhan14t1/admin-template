import { Input, Modal } from 'antd';
import { useContext, useState } from 'react';
import { errorAlert, successAlert } from '../../../../shared/utils/alertUtils';
import { put } from '../../../../shared/utils/apiUtils';
import AppContext from '../../../../shared/contexts/AppContext';

const ChangePassModal = ({ open, onClose }) => {
  const [data, setData] = useState({});
  const { setLoading } = useContext(AppContext);
  const handleOk = () => {
    if (!validateData()) {
      return;
    }

    const { oldPass, newPass } = data;
    setLoading(true);
    put('/account/password', { oldPass, newPass }, false)
      .then(res => {
        if (res) {
          successAlert('Đổi mật khẩu thành công');
          onCancel();
        }
      }).finally(() => setLoading(false));
  }

  const validateData = () => {
    if (!data.oldPass?.trim() || !data.newPass?.trim() || !data.newPassConfirm?.trim()) {
      errorAlert('Hãy nhập đầy đủ thông tin');
      return false;
    }

    if (data.newPass != data.newPassConfirm) {
      errorAlert('Mật khẩu mới và Nhập lại mật khẩu mới không khớp');
      return false;
    }

    return true;
  }

  const onCancel = () => {
    setData({});
    onClose();
  }

  return (
    <Modal title="Đổi mật khẩu" open={open} width={500} closeIcon={false} cancelText='Hủy'
      onOk={handleOk} onCancel={onCancel} maskClosable={false}>
      <b className='d-block mt-2'>Mật khẩu cũ:</b>
      <div className='mt-2'>
        <Input key='oldPass' className='w-100' placeholder=''
          value={data.oldPass} type='password'
          onChange={e => setData({ ...data, oldPass: e.target.value })}
          onKeyDown={e => e.keyCode == 13 && handleOk()}></Input>
      </div>

      <b className='d-block mt-3'>Mật khẩu mới:</b>
      <div className='mt-2'>
        <Input key='newPass' className='w-100' placeholder=''
          value={data.newPass} type='password'
          onChange={e => setData({ ...data, newPass: e.target.value })}
          onKeyDown={e => e.keyCode == 13 && handleOk()}></Input>
      </div>

      <b className='d-block mt-3'>Nhập lại mật khẩu mới:</b>
      <div className='mt-2'>
        <Input key='newPassConfirm' className='w-100' placeholder=''
          value={data.newPassConfirm} type='password'
          onChange={e => setData({ ...data, newPassConfirm: e.target.value })}
          onKeyDown={e => e.keyCode == 13 && handleOk()}></Input>
      </div>
    </Modal>
  )
}

export default ChangePassModal;