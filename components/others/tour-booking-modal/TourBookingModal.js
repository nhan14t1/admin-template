import { Button, DatePicker, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { post } from '../../../shared/utils/apiUtils';
import { successAlert, errorAlert } from '../../../shared/utils/alertUtils';
import styles from './TourBookingModal.module.scss';
import { getPostHistory } from '../../../shared/utils/viewHistoryUtils';

const TourBookingModal = ({ open, onClose, tour, refCode }) => {
  const defaultData = { planPeople: 1 };
  const [info, setInfo] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    if (!validateData()) {
      return;
    }

    const { name, phone, email, planDate, planPeople } = info;
    const postHistory = getPostHistory();
    const refPostId = postHistory.length ? postHistory[0].id : null;
    const postData = {
      name, phone, email, planDate: planDate.toDate().getTime(), planPeople, tourId: tour.id, isDraft: false,
      refCode, refPostId, postHistory: JSON.stringify(postHistory)
    };

    setLoading(true);

    post('/tour-booking', postData, false).then(res => {
      if (res && res.data) {
        successAlert('Gửi thông tin đặt tour thành công, chúng tôi sẽ sớm liên hệ với bạn.', 6000);
        onCancel();
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  const validateData = () => {
    const { name, phone, email, planDate, planPeople } = info;
    if (!(name || '').trim()) {
      errorAlert('Vui lòng nhập Họ và tên');
      return false;
    }

    if (!(phone || '').trim()) {
      errorAlert('Vui lòng nhập Số điện thoại');
      return false;
    }

    if (!(email || '').trim()) {
      errorAlert('Vui lòng nhập email');
      return false;
    }

    if (!planDate) {
      errorAlert('Vui lòng chọn ngày đi dự kiến');
      return false;
    }

    if (!planPeople || isNaN(planPeople)) {
      errorAlert('Vui lòng nhập số người dự kiến');
      return false;
    }

    return true;
  }

  const onCancel = () => {
    setInfo(defaultData);
    onClose();
  }

  const title = `Đặt tour "${tour?.title}"`;

  return (
    <Modal title={title} open={open} width={500}
      onOk={handleOk} onCancel={onCancel} maskClosable={false}
      okText='Gửi thông tin' okButtonProps={{ loading }}
      cancelButtonProps={{ style: { display: 'none' } }}
      className={styles.wrapper}>
      <b className='d-block mt-3'>Họ và tên:</b>
      <div className='mt-2'>
        <Input key='name' className='w-100' placeholder='Nguyễn Văn A'
          value={info.name}
          onChange={e => setInfo({ ...info, name: e.target.value })}
          autoFocus />
      </div>

      <b className='d-block mt-3'>Số điện thoại:</b>
      <div className='mt-2'>
        <Input key='phone' className='w-100' placeholder='Nhập số điện thoại'
          value={info.phone}
          onChange={e => setInfo({ ...info, phone: e.target.value })} />
      </div>

      <b className='d-block mt-3'>Email:</b>
      <div className='mt-2'>
        <Input key='email' className='w-100' placeholder='Nhập email của bạn'
          value={info.email}
          onChange={e => setInfo({ ...info, email: e.target.value })} />
      </div>

      <div className='row'>
        <div className='col-6'>
          <b className='d-block mt-3'>Ngày đi dự kiến:</b>
          <div className='mt-2'>
            <DatePicker
              value={info.planDate}
              onChange={planDate => setInfo({ ...info, planDate })}
              placeholder='Chọn ngày' />
          </div>
        </div>
        <div className='col-6'>
          <b className='d-block mt-3'>Số người dự kiến:</b>
          <div className='mt-2'>
            <InputNumber key='planPeople' value={info.planPeople} onChange={e => setInfo({ ...info, planPeople: e })} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TourBookingModal;