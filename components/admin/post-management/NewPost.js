import { Button, Empty, Input, Radio, Select, Spin, Tooltip, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { CATEGORIES_POST, IMAGE_EXTENSIONS_ALLOWED, IMAGE_POST_PREFIX, POST_STATUS, TAG_TYPES } from '../../../shared/constants/app-const';
import { toSlug } from '../../../shared/utils/stringUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { get, post, put } from '../../../shared/utils/apiUtils';
import { useRouter } from 'next/router';
import HtmlEditor from '../../shared/HtmlEditor';
import ThumbnailUpload from './components/ThumbnailUpload';
import AppContext from '../../../shared/contexts/AppContext';
import { useSearchParams } from 'next/navigation';
import { compressBase64ToBase64 } from '../../../shared/utils/imageCompressUtils';
import styles from './PostManagement.module.scss';
import CreateTourLink from '../../shared/CreateTourLink/CreateTourLink';
import DxHtmlEditor from '../../shared/DxHtmlEditor/DxHtmlEditor';
import UnsavedChangesNotification from '../../shared/UnsavedChangesNotification';
import { objectCompare } from '../../../shared/utils/commonUtils';
import CommonLinks from './components/CommonLinks';
import { buildPostUrl } from '../../../shared/utils/urlUtils';
import PostScheduleModal from './components/PostScheduleModal';
import ImgAltInsert from '../components/img-alt-insert/ImgAltInsert';
import { applyAllAltText, findImgTags, findUrlAlts } from '../../../shared/utils/imgAltUtils';
import { warningAlert } from '../../../shared/utils/alertUtils';
import SeoTip from '../../shared/SeoTip/SeoTip';

let tagTimeout;

const NewPost = props => {
  const router = useRouter();
  const [originalPostObj, setOriginalPostObj] = useState({});
  const [postObj, setPostObj] = useState({});
  const [isError, setIsError] = useState(false);
  const [tours, setTours] = useState([]);
  const [searchTagLoading, setSearchTagLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [useNewEditor, setUseNewEditor] = useState(1);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [imgTags, setImgTags] = useState([]);
  const [imgUrlAlts, setImgUrlAlts] = useState({});
  const [seoTipRefreshNumber, setSeoTipRefreshNumber] = useState(0);
  const { setLoading } = useContext(AppContext);

  const categoryOptions = Object.values(CATEGORIES_POST).map(_ => ({ value: _.id, label: _.name }));

  const isEdit = postObj && postObj.id;
  const params = useSearchParams()

  useEffect(() => {
    const id = params.get('id');
    id && getData(id);
    getTours();
  }, []);

  const getTours = () => {
    get('/admin/tour', false).then(res => {
      if (res && res.data) {
        setTours(res.data);
      }
    });
  }

  const getData = (id) => {
    setLoading(true)
    get(`/admin/post/${id}`)
      .then(res => {
        if (res && res.data) {
          const postObj = res.data;
          postObj.categoryIds = (postObj.categories || []).map(_ => _.id);
          setTagOptions(postObj.tags.map(_ => ({ value: _.id, label: _.text })));
          postObj.tags = postObj.tags.map(_ => _.id);
          setOriginalPostObj(Object.assign({}, postObj));
          setPostObj(postObj);
          onRefreshFindingImgsContent(postObj.content);
          setImgUrlAlts(findUrlAlts(postObj.content));
          postObj.keywords = (postObj.keyword || '').split(';').filter(_ => !!_);
        }
      }).catch(err => {
        setIsError(true);
      }).finally(() => setLoading(false));
  }

  const onTitleBlur = () => {
    if (!postObj.slug && postObj.title && postObj.title.trim()) {
      setPostObj({ ...postObj, slug: toSlug(postObj.title) });
    }
  }

  const processOtherProperties = (scheduleTimeStamp) => {
    let imageUrls = processImageUrls();
    let tags = postObj.tags || [];
    tags = tags.map(item => {
      if (!isNaN(item)) {
        return { id: item };
      }

      return { text: item };
    });

    let result = { imageUrls, tags };
    if (scheduleTimeStamp) {
      result.scheduleDate = scheduleTimeStamp;
    }

    try {
      // Apply alt text to image tags
      result.content = applyAllAltText(postObj.content, imgUrlAlts);
    } catch (error) {
      warningAlert(`Có lỗi khi đặt alt text cho ảnh, nhưng bài viết vẫn được đăng bình thường, lưu ý chụp thông báo này lại và gửi cho admin:\n ${error.message}`, 8000);
    }

    return result;
  }

  const onCreate = (postStatus = POST_STATUS.Active.id, scheduleTimeStamp = 0) => {
    if (!validateCreation()) {
      return;
    }

    const otherProperties = processOtherProperties(scheduleTimeStamp);

    const request = { ...postObj, ...otherProperties };
    request.status = postStatus;

    setLoading(true);
    post('/admin/post', request, false)
      .then(res => {
        if (res) {
          setOriginalPostObj(postObj);
          setTimeout(() => router.push('/admin/post-management'), 100);
        }
      }).finally(() => {
        setLoading(false);
      });
  }

  const onUpdate = (postStatus = POST_STATUS.Active.id, scheduleTimeStamp = 0) => {
    if (!validateCreation()) {
      return;
    }

    if (postStatus == POST_STATUS.Draft.id && postObj.status == POST_STATUS.Schedule.id) {
      postStatus = POST_STATUS.Schedule.id;
    }

    const otherProperties = processOtherProperties(scheduleTimeStamp);

    const request = { ...postObj, ...otherProperties };
    request.status = postStatus;

    setLoading(true);
    put('/admin/post', request, false)
      .then(res => {
        if (res) {
          setOriginalPostObj(postObj);
          setTimeout(() => router.push('/admin/post-management'), 100);
        }
      }).finally(() => {
        setLoading(false);
      });
  }

  // In case we insert an image, then we delete the image on UI => Need to remove this image to save server storage.
  const processImageUrls = () => {
    // To make sure the regex won't detect 2 result into 1 result
    const content = (postObj.content || '').replaceAll(`<img`, `\n<img`);

    const imageExtensionsPattern = IMAGE_EXTENSIONS_ALLOWED.join('|');
    const pattern = new RegExp(`${IMAGE_POST_PREFIX}.*\.(${imageExtensionsPattern})`, 'g');
    return content.match(pattern);
  }

  const validateCreation = () => {
    return true;
  }

  const onThumbnailChanged = async (base64) => {
    const compressedBase64 = await compressBase64ToBase64(base64, 0.3, 500);
    setPostObj({ ...postObj, thumbnail: { ...postObj.thumbnail, base64: compressedBase64 } });
  }

  const onSearchTag = (keyword) => {
    if (tagTimeout) {
      clearTimeout(tagTimeout);
      tagTimeout = null;
    }

    tagTimeout = setTimeout(() => searchTag(keyword), 400);
  }

  const searchTag = (keyword) => {
    if (keyword?.length < 2) {
      return;
    }

    setTagOptions([]);
    setSearchTagLoading(true);

    post('/admin/tag/search', { keyword, type: TAG_TYPES.Post }, false)
      .then(res => {
        if (res) {
          let options = (res.data || []).map(tag => ({
            value: tag.id,
            label: tag.text,
          }));

          options = options.length ? options : [{ value: keyword, label: keyword }];
          setTagOptions(options);
        }
      }).finally(() => setSearchTagLoading(false));
  }

  const hasUnsavedChanges = () => {
    return (postObj.title || '') != (originalPostObj.title || '')
      || (postObj.slug || '') != (originalPostObj.slug || '')
      || (postObj.content || '') != (originalPostObj.content || '')
      || !objectCompare(postObj.tags || [], originalPostObj.tags || [])
      || !objectCompare(postObj.categoryIds || [], originalPostObj.categoryIds || []);
  }

  const onScheduleClicked = () => {
    if (!validateCreation()) {
      return;
    }

    setScheduleModalOpen(true);
  }

  const onSchedule = (date) => {
    const timestamp = date.getTime();
    if (isEdit) {
      onUpdate(POST_STATUS.Schedule.id, timestamp);
    } else {
      onCreate(POST_STATUS.Schedule.id, timestamp);
    }
  }

  if (isError) {
    return <Empty description="Không có dữ liệu" className='pt-5'></Empty>
  }

  const onRefreshFindingImgsContent = (html) => {
    const imgTags = findImgTags(html);
    setImgTags(imgTags);
  }

  const onAltChanged = data => {
    setImgUrlAlts({ ...data });

    // Trick to calculate the Seo Tip
    setSeoTipRefreshNumber(seoTipRefreshNumber + 1);
  }

  const onKeywordsChange = value => {
    const keyword = value.join(';');
    setPostObj({...postObj, keyword});
    if (isEdit) {
      updateKeyword(keyword);
    }
  }

  const updateKeyword = (keyword) => {
    const data = { id: postObj.id, keyword};
    put('/admin/post/keyword', data, false, false)
      .then(res => {
        console.log(res.data);
      });
  }

  return <div className='new-post'>
    <div className='app-box'>
      <h2>{isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}</h2>
      <b className='mt-5 d-block'>Tiêu đề:</b>
      <div className='mt-2'>
        <Input key='title' className='w-100' placeholder='Nhập tiêu đề...'
          value={postObj.title}
          onChange={e => setPostObj({ ...postObj, title: e.target.value })}
          onBlur={e => onTitleBlur()}></Input>
      </div>

      <div className='mt-3'>
        <b>Slug</b>&nbsp;&nbsp;
        <Button key="btnSlug" type='primary' size='small' ghost
          disabled={!postObj.title || !postObj.title.trim()}
          onClick={() => setPostObj({ ...postObj, slug: toSlug(postObj.title) })}>
          <FontAwesomeIcon icon={faRedoAlt} />&nbsp;
          Tạo slug
        </Button>
      </div>
      <div className='mt-2'>
        <Input key='slug' className='w-100' placeholder='Ví dụ: an-gi-hom-nay'
          value={postObj.slug}
          onChange={e => setPostObj({ ...postObj, slug: e.target.value })}></Input>
      </div>

      <b className='mt-3 d-block'>Tóm tắt:</b>
      <div className='mt-2'>
        <Input key='introText' className='w-100' placeholder='Giới thiệu vắn tắt để gây sự tò mò'
          value={postObj.introText}
          onChange={e => setPostObj({ ...postObj, introText: e.target.value })}></Input>
      </div>

      <b className='mt-3 d-block'>Categories:</b>
      <div className='mt-2'>
        <Select
          key='categories'
          mode="multiple"
          allowClear
          style={{
            width: '100%',
          }}
          placeholder="Chọn 1 hoặc nhiều category"
          value={postObj.categoryIds || []}
          onChange={(e) => setPostObj({ ...postObj, categoryIds: e })}
          options={categoryOptions}
        />
      </div>

      <b className='mt-3 d-block'>
        Nhãn (Tùy chọn)&nbsp;
        <Tooltip title='Gắn 1 vài từ khóa liên quan đến bài viết làm nhãn, những bài viết có nhãn giống nhau sẽ được đề xuất hiển thị ở mục "Tin tức liên quan" khi người dùng đọc tin tức.'>
          <FontAwesomeIcon icon={faExclamationCircle} />
        </Tooltip>
      </b>
      <div className='mt-2'>
        <Select
          key='tag'
          showSearch
          mode="multiple"
          allowClear
          className='w-100'
          value={postObj.tags}
          placeholder={'Chọn 1 vài từ khóa liên quan'}
          defaultActiveFirstOption={true}
          onSearch={onSearchTag}
          onChange={(e) => setPostObj({ ...postObj, tags: e })}
          notFoundContent={<div className='py-2'>{searchTagLoading ? <Spin size="small" /> : null}</div>}
          options={tagOptions}
          filterOption={false}
        />
      </div>

      <div className='row mt-3'>
        <div className='col-12 col-md-8'>
          <div>
            <b>Thumbnail:</b>

            {isEdit &&
              <span> &nbsp;<Typography.Text type="secondary">(Chế độ edit sẽ không hiển thị thumbnail trước đó, nhưng vẫn có thể đổi thumbnail)</Typography.Text></span>
            }
          </div>
          <div className='mt-2'>
            <ThumbnailUpload image={postObj.thumbnail} onChange={thumbnail => setPostObj({ ...postObj, thumbnail })}
              onCropped={base64 => onThumbnailChanged(base64)} onCancelled={() => setPostObj({ ...postObj, thumbnail: null })} />
          </div>

          <div className='mt-3'>
            <b>Nội dung:</b>
            <Typography.Text type="secondary">&nbsp;(Sử dụng ảnh với định dạng [{IMAGE_EXTENSIONS_ALLOWED.join(', ')}], không chèn 2 ảnh trên cùng 1 dòng)</Typography.Text>
          </div>

          <div className='d-flex'>
            <Radio.Group className='mt-3 ms-auto' onChange={e => { postObj.defaultValue = postObj.content; setUseNewEditor(e.target.value) }} value={useNewEditor}>
              <Radio value={1}>Sử dụng trình soạn cũ</Radio>
              <Radio value={0}>Sử dụng trình soạn mới (Nếu muốn dùng chức năng tạo bảng)</Radio>
            </Radio.Group>
          </div>

          <div className='mt-2'>
            {!!useNewEditor &&
              <HtmlEditor key='html-editor' value={postObj.content} onChange={content => setPostObj({ ...postObj, content })} onImageInsertedDeleted={onRefreshFindingImgsContent} />
            }

            {!useNewEditor &&
              <DxHtmlEditor key='dx-html-editor' value={postObj.content} onChange={content => { postObj.content = content }} onImageInsertedDeleted={onRefreshFindingImgsContent}
                multiline={true} />
            }
          </div>
        </div>

        <div className='col-12 col-md-4'>
          <div className={styles.tour_link_wrap}>
            <ImgAltInsert imgStrings={imgTags} imgUrlAlts={imgUrlAlts} onChange={onAltChanged} />
          </div>

          <div className={`${styles.tour_link_wrap} mt-4`}>
            <CreateTourLink tours={tours} />
          </div>

          <div className={`${styles.tour_link_wrap} mt-4`}>
            <CommonLinks showCurrentPostLink currentTitle={postObj.title} currentUrl={postObj.slug ? buildPostUrl(postObj.slug, true) : ''} />
          </div>
        </div>
      </div>

      <div className='mt-5 pt-5 pt-sm-3 d-flex'>
        <div className='ms-auto'>
          {!isEdit &&
            <>
              <Button key='btn-draft' type='default' onClick={() => onCreate(POST_STATUS.Draft.id)}>Lưu nháp</Button>
              <Button key='btn-publish' className='ms-2' type='primary'
                onClick={() => onCreate()}>Xuất bản</Button>
            </>
          }

          {isEdit &&
            <>
              {postObj.status != POST_STATUS.Active.id &&
                <Button key='btn-draft' className='ms-2' type='default'
                  onClick={() => onUpdate(POST_STATUS.Draft.id)}>Lưu nháp</Button>
              }

              <Button key='btn-publish' className='ms-2' type='primary'
                onClick={() => onUpdate()}>{postObj.status != POST_STATUS.Active.id ? 'Xuất bản' : 'Lưu'}</Button>
            </>
          }

          {(!isEdit || postObj.status != POST_STATUS.Active.id) &&
            <Button key='btn-schedule' className='ms-2' type='primary' ghost onClick={onScheduleClicked}>Lên lịch</Button>
          }
        </div>
      </div>
    </div>

    <UnsavedChangesNotification hasUnsavedChanges={hasUnsavedChanges()} />
    <PostScheduleModal open={scheduleModalOpen} onCancel={() => setScheduleModalOpen(false)} onOk={onSchedule} />
    <SeoTip slug={postObj.slug} title={postObj.title} introText={postObj.introText}
      content={postObj.content} imgUrlAlts={imgUrlAlts}
      defaultKeywords={postObj.keywords} onKeywordsChange={onKeywordsChange}
      refreshNumber={seoTipRefreshNumber} />
  </div>
}

export default NewPost;