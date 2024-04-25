import { Button, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { getUserRefCode } from "../../../shared/utils/accountUtils";
import { QUERY_PARAMS } from "../../../shared/constants/url-const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

const CreateTourLink = ({ tours }) => {
  const [randKey] = useState(Math.floor(Math.random() * 1000));
  const [tourId, setTourId] = useState(null);
  const [linkText, setLinkText] = useState('');
  const [url, setUrl] = useState('');
  const [refCode, setRefCode] = useState('');

  useEffect(() => {
    const code = getUserRefCode();
    setRefCode((code || '').toLowerCase());
  });

  const tourOptions = (tours || []).map(_ => ({ value: _.id, label: _.title }));

  const onTourSelected = value => {
    setTourId(value);
    const tour = tours.find(_ => _.id == value);
    setLinkText(tour.title);
    const url = `/tour/${tour.slug}?${QUERY_PARAMS.refCode}=${refCode}`;
    setUrl(url);

    setTimeout(() => {
      document.getElementById('txtLinkText')?.focus();
    }, 100)
  }

  const onReset = () => {
    setTourId(null);
    setLinkText('');
    setUrl('');
  }

  if (!refCode) {
    return <div className="text-center">
      <b className="d-block text-center mt-2">Chức năng tạo link tour</b>
      <br/>
      <br/>
      <FontAwesomeIcon icon={faWarning} style={{ color: 'red' }} />
      &nbsp;
      <Typography.Text type="secondary">
        Bạn chưa có mã ref để sử dụng chức năng link tour,
        thử logout login lại hoặc liên hệ admin.
      </Typography.Text>
    </div>
  }

  return <>
    <b className="d-block text-center mt-2">Chức năng tạo link tour</b>
    <div className="mt-3">Chọn tour:</div>
    <Select
      key={`drTourLink${randKey}`}
      value={tourId}
      className='w-100 mt-2'
      placeholder="Tìm và chọn một tour"
      onChange={onTourSelected}
      options={tourOptions}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    />

    <div className="mt-3">
      Đặt tên cho link nếu cần
      <Typography.Text type="secondary">&nbsp;(Ví dụ: Tour Hội An)</Typography.Text>
    </div>
    <Input value={linkText} onChange={e => setLinkText(e.target.value)}
      key={`txtText${randKey}`} className="w-100 mt-2" id='txtLinkText'/>

    <div className="mt-4">
      <b>Kết quả:</b>
      <Typography.Text type="secondary">&nbsp;(Bôi đen link rồi copy đi, tui lười code thêm quá -_-)</Typography.Text>
    </div>

    <div className="mt-3">
      {(!linkText || !url) &&
        <div className="text-muted">Chọn một tour và đặt tên để xem kết quả</div>
      }

      {linkText?.trim() && url &&
        <div className="mt-3 app-content">
          <a href={url} target="_blank">{linkText}</a>
          <div className="mt-3">
            <Button type="primary" ghost onClick={onReset}>Reset</Button>
          </div>
        </div>
      }
    </div>
  </>
}

export default CreateTourLink;