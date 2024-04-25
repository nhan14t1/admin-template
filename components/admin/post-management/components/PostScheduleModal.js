import { Button, DatePicker, Modal, Typography } from "antd";
import { useState } from "react";
import * as dayjs from 'dayjs'

const PostScheduleModal = ({ open, onCancel, onOk }) => {
  const [date, setDate] = useState(null);

  const onChange = (dayjsValue) => {
    setDate(dayjsValue);
  }

  const handleOk = () => {
    if (!date) {
      return;
    }

    onOk(date.$d);
  }

  const onFastSetDate = (afterDay) => {
    const HOUR = 9 // 9:00 every x day
    const MILISECOND_OF_DATE = 86400000;
    let date = new Date();
    date = new Date(date.getTime() + afterDay * MILISECOND_OF_DATE);
    date.setHours(HOUR, 0, 0, 0);
    setDate(dayjs(date));
  }

  return <Modal title="Lên lịch đăng bài" open={open} cancelText='Hủy' closeIcon={false}
    onOk={handleOk} onCancel={onCancel} maskClosable={false}>
    <div className="mt-4">
      <b>Thời gian: &nbsp;</b>
      <DatePicker
        value={date}
        placeholder="Chọn thời gian"
        showTime={{
          format: 'HH:mm',
        }}
        format="DD-MM-YYYY HH:mm"
        onOk={onChange} />

      <div className="mt-4 mb-4">
        <Typography.Text type="secondary">Chọn nhanh thời gian đăng bài:</Typography.Text>
        <div className="mt-2">
          <Button type="primary" className="me-2" ghost onClick={() => onFastSetDate(1)}>Ngày mai</Button>
          <Button type="primary" className="me-2" ghost onClick={() => onFastSetDate(2)}>2 ngày sau</Button>
          <Button type="primary" className="me-2" ghost onClick={() => onFastSetDate(3)}>3 ngày sau</Button>
          <Button type="primary" ghost onClick={() => onFastSetDate(4)}>4 ngày sau</Button>
        </div>
      </div>

      <div className="mt-2 text-small"><i>Lưu ý: Bài viết sẽ được xuất bản chậm trong vòng 10 phút sau thời gian lên lịch.</i></div>
    </div>
  </Modal>
}

export default PostScheduleModal;