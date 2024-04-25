import { Input, Typography } from "antd";
import { BASE_URL, WEB_NAME_WITH_SPACE } from "../../../../shared/constants/app-const";
import { useEffect, useState } from "react";

const CommonLinks = ({ showCurrentPostLink, currentTitle, currentUrl }) => {
  const [customCurrentTitle, setCustomCurrentTitle] = useState('');
  const [isTitleCustomed, setIsTitleCustomed] = useState(false);

  useEffect(() => {
    if (!isTitleCustomed) {
      setCustomCurrentTitle(currentTitle);
    }
  }, [currentTitle]);

  const onCustomTitleChanged = e => {
    if (!isTitleCustomed) {
      setIsTitleCustomed(true);
    }
    setCustomCurrentTitle(e.target.value);
  }

  return <>
    <div className="text-center">
      <div><b>Một số link thường dùng</b></div>
      <Typography.Text type="secondary">(Bôi đen link và copy rồi paste vào bài viết để tiết kiệm thời gian)</Typography.Text>
    </div>

    <div className="app-content mt-3">
      <div>
        Trang chủ: <a href={BASE_URL} target="_blank">{WEB_NAME_WITH_SPACE}</a>
      </div>

      {showCurrentPostLink &&
        <div className="mt-4">
          Link bài viết hiện tại:&nbsp;
          {(!currentTitle || !currentUrl) &&
            <Typography.Text type="secondary">(Hãy đặt tiêu đề và slug bài viết để hiện link)</Typography.Text>
          }

          {currentTitle && currentUrl &&
            <>
              <a href={currentUrl} target="_blank">{customCurrentTitle}</a>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: '15px' }}>Thay đổi tiêu đề link bài viết hiện tại nếu cần:</Typography.Text>
                <Input value={customCurrentTitle} onChange={onCustomTitleChanged} style={{fontSize: '14px'}}/>
              </div>
            </>
          }
        </div>
      }
    </div>
  </>
}

export default CommonLinks;