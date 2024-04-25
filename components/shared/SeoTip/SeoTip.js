import { Drawer, Collapse, Select, Spin, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import classes from './SeoTip.module.scss';
import { calculateSeo } from './helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faCheck, faCircleCheck, faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';

let seoTipTimeout = null;

const SeoTip = ({ title, slug, introText, content, imgUrlAlts, defaultKeywords, onKeywordsChange,
  refreshNumber }) => {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [seoObj, setSeoObj] = useState({});
  const [errorCount, setErrorCount] = useState({});

  useEffect(() => {
    if (defaultKeywords?.length && !keywords.length) {
      setKeywords(defaultKeywords);
    }
  }, [defaultKeywords]);

  useEffect(() => {
    calculateSeoTimeout();
  }, [keywords, title, slug, introText, content, Object.keys(imgUrlAlts).length, refreshNumber]);

  const calculateSeoTimeout = () => {
    if (seoTipTimeout) {
      clearTimeout(seoTipTimeout);
    }

    setWaiting(true);

    seoTipTimeout = setTimeout(() => {
      doCalculate();
      seoTipTimeout = null;
      setWaiting(false);
    }, 500);
  }

  const doCalculate = () => {
    const { basicSeo, additionalSeo } = calculateSeo({ keywords, title, slug, introText, content, imgUrlAlts: Object.assign({}, imgUrlAlts) });
    setSeoObj({ basicSeo, additionalSeo });

    const errorCount = {
      basicSeo: basicSeo.filter(_ => !_.passed).length,
      additionalSeo: additionalSeo.filter(_ => !_.passed).length,
    };
    errorCount.total = errorCount.basicSeo + errorCount.additionalSeo;

    setErrorCount(errorCount);
  }

  const onKeywordChange = value => {
    onKeywordsChange(value);
    setKeywords(value);
  }

  const renderItem = (item) => {
    const icon = item.passed ? faCircleCheck : faCircleXmark;

    return <div key={`ki${item.id}`} className={`${item.passed ? classes.passed : ''}`}>
      <FontAwesomeIcon icon={icon} />
      <label>{item.title}</label>
    </div>
  }

  const renderTitle = () => {
    return <div className='d-flex align-items-center'>
      Đánh giá SEO
      {waiting &&
        <span className={`ms-auto app-color ${classes.calculating_label}`}>
          <Spin />&nbsp;
          Calculating...
        </span>
      }
    </div>
  }

  const renderBasicSeoTitle = () => {
    return <div className='d-flex align-item-centers'>
      <span>SEO Cơ bản</span>
      <span className={`ms-auto badge ${!errorCount.basicSeo ? 'bg-success' : 'bg-danger'}`}>
        {!!errorCount.basicSeo &&
          <><FontAwesomeIcon icon={faXmark} />&nbsp; {errorCount.basicSeo} lỗi</>
        }
        {!errorCount.basicSeo &&
          <><FontAwesomeIcon icon={faCheck} />&nbsp; Good job</>
        }
      </span>
    </div>
  }

  const renderAdditionalSeoTitle = () => {
    return <div className='d-flex align-item-centers'>
      <span>Mở rộng</span>
      <span className={`ms-auto badge ${!errorCount.additionalSeo ? 'bg-success' : 'bg-danger'}`}>
        {!!errorCount.additionalSeo &&
          <><FontAwesomeIcon icon={faXmark} />&nbsp; {errorCount.additionalSeo} lỗi</>
        }
        {!errorCount.additionalSeo &&
          <><FontAwesomeIcon icon={faCheck} />&nbsp; Good job</>
        }
      </span>
    </div>
  }

  return <>
    <Tooltip title="Nhấn để mở chức năng gợi ý SEO">
      <div className={`${classes.seo_btn} ${errorCount.total ? classes.error : ''}`} onClick={() => setOpen(!open)}>
        <span>SEO</span>
        {waiting && <span className={classes.spin}><Spin /></span>}
        {!!errorCount.total && <label>{errorCount.total}</label>}
      </div>
    </Tooltip>

    <Drawer title={renderTitle()} onClose={() => setOpen(false)} open={open} mask={false} width={300}
      className={classes.drawer} >
      <section className='mt-2'>
        <b>Từ khóa:</b>
        <Select
          mode="tags"
          className='w-100 mt-2'
          placeholder="Nhập 1 vài từ khóa"
          onChange={onKeywordChange}
          value={keywords}
        />
      </section>

      <Collapse defaultActiveKey={['1', '2', '3']} className='mt-4'>
        <Collapse.Panel key={`1`} header={renderBasicSeoTitle()} forceRender={true} >
          <div className={classes.items}>
            {(seoObj.basicSeo || []).map(item => renderItem(item))}
          </div>
        </Collapse.Panel>
        <Collapse.Panel key={`2`} header={renderAdditionalSeoTitle()} forceRender={true}>
          <div className={classes.items}>
            {(seoObj.additionalSeo || []).map(item => renderItem(item))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </Drawer>
  </>
}

export default SeoTip;