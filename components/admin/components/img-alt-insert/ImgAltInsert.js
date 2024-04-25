import { Empty, Input, Typography } from "antd";
import Image from 'next/legacy/image';
import { findImgUrl } from "../../../../shared/utils/imgAltUtils";

const ImgAltInsert = ({ imgStrings, imgUrlAlts, onChange }) => {
  const renderImgs = () => {
    return (imgStrings || []).map((imgTag, index) => {
      var url = findImgUrl(imgTag);
      var altText = imgUrlAlts[url] || '';

      return <div key={`idw${index}`} className="d-flex align-items-center mt-2">
        <Image key={`img${index}`} src={url} width={50} height={40} />
        <Input value={altText} onChange={e => onAltChange(e.target.value, url)}
          key={`ia${index}`} className="ms-auto" style={{ width: 'calc(100% - 60px)' }}
          placeholder="Ví dụ: Cầu rồng Đà Nẵng" />
      </div>
    });
  }

  const onAltChange = (value, imgUrl) => {
    imgUrlAlts[imgUrl] = value;
    onChange(imgUrlAlts);
  }

  return <>
    <div className="text-center">
      <div><b>Đặt caption cho ảnh</b></div>
      <Typography.Text type="secondary">(Đặt caption vào thẻ alt của ảnh để tăng điểm SEO)</Typography.Text>
    </div>

    <div className="mt-3">
      {!imgStrings?.length && <Empty description='Không tìm thấy ảnh nào' />}

      {renderImgs()}
    </div>
  </>
}

export default ImgAltInsert;