import HtmlEditor, {
  Toolbar,
  MediaResizing,
  Item,
} from 'devextreme-react/html-editor';
import { BASE_IMAGE_URL } from '../../../shared/constants/app-const';
import { useCallback, memo, useRef, useState, useEffect, useMemo } from 'react';
import ThumbnailUpload from '../../admin/post-management/components/ThumbnailUpload';
import { compressBase64 } from '../../../shared/utils/imageCompressUtils';
import { errorAlert } from '../../../shared/utils/alertUtils';
import { postFile } from '../../../shared/utils/apiUtils';

import 'devextreme/dist/css/dx.light.css';

const sizeValues = ['12px', '14px', '16px', '17px', '18px', '20px', '22px', '24px', '36px'];
const fontSizeOptions = {
  value: '16px'
};
const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = {
  inputAttr: {
    'aria-label': 'Font family',
  },
};

let previousIndex = 0;

const DxHtmlEditor = ({ value: propValue, onChange, enableFontSize, height, multiline, onImageInsertedDeleted }) => {
  const editorRef = useRef(null);
  const uploadRef = useRef(null);
  const [randKey] = useState(Math.floor(Math.random() * 1000));
  const [value, setValue] = useState(propValue);

  const insertImage = (url) => {
    const currentIndex = editorRef.current.instance.getQuillInstance().getSelection()?.index || previousIndex;
    editorRef.current.instance.insertEmbed(currentIndex, "extendedImage", {
      src: url
    });

    setTimeout(() => onImageInsertedDeleted && onImageInsertedDeleted(value), 300);
  }

  useEffect(() => {
    if (propValue && !value) {
      setValue(propValue);
    }
  }, [propValue]);

  const uploadDivId = `uploadDiv${randKey}`;

  const onUploadImageClicked = () => {
    document.querySelector(`#${uploadDivId} input[type="file"]`).click();
  }

  // const customButtonClick = useMemo(() => {
  //   onUploadImageClicked();
  // }, [onUploadImageClicked]);

  const getToolbarButtonOptions = useMemo(() => ({
    text: 'Chèn ảnh',
    type: 'success',
    onClick: onUploadImageClicked,
  }), []);

  const onImageSelected = async ({ base64, name }) => {
    const compressedFile = await compressBase64(base64, 0.3, 1200);
    const formData = new FormData();
    formData.append("image", new File([compressedFile], name));

    postFile('/admin/file/image', formData)
      .then((result) => {
        let url = `${BASE_IMAGE_URL}/${result.data.name}`;
        insertImage(url);
      })
      .catch((error) => {
        errorAlert(`Có lỗi xảy ra khi chèn ảnh: ${error.message}`);
      });
  }

  const onCachePreviousIndex = () => {
    setTimeout(() => {
      previousIndex = editorRef.current.instance.getQuillInstance().getSelection()?.index || previousIndex;
    }, 20);
  }

  const onValueChanged = e => {
    previousIndex = editorRef.current.instance.getQuillInstance().getSelection()?.index || previousIndex;
    if (e.event?.type === 'paste')
    {
      e.value = handleValuePasted(e);
    }

    setValue(e.value);
    onChange(e.value);
  }

  const handleValuePasted = (e) => {
    var divElement = document.createElement('div');
    divElement.innerHTML = e.value;
    var styledElements = divElement.querySelectorAll('[style]');
    for (var i = 0; i < styledElements.length; i++) {
      var el = styledElements[i];
      if (el.style.fontFamily !== '') {
        el.style.fontFamily = '';
      }
    }

    return divElement.innerHTML;
  }

  const onContentReady = e => {
    e.component.format('size', '16px');
  }

  return <>
    <div id={uploadDivId} className='d-none'>
      <ThumbnailUpload onChange={onImageSelected} ignoreCrop={true} ref={uploadRef} key={`thumb${randKey}`} />
    </div>

    <HtmlEditor ref={editorRef} key={`dx-he${randKey}`}
      height={height || 700}
      value={value}
      onValueChanged={onValueChanged}
      onFocusIn={onCachePreviousIndex}
      className='app-content'
      onContentReady={onContentReady}
      valueType={'html'}
    >
      <MediaResizing enabled={true} />
      <Toolbar multiline={!!multiline}>
        <Item
          name="header"
          acceptedValues={headerValues}
          options={headerOptions}
        />
        <Item name="separator" />

        {false &&
          <Item
            name="size"
            // acceptedValues={sizeValues}
            acceptedValues={['16px']}
            options={fontSizeOptions}
          />
        }
        {enableFontSize &&
          <Item name="separator" />
        }

        <Item name="bold" />
        <Item name="italic" />
        <Item name="strike" />
        <Item name="underline" />
        <Item name="separator" />
        <Item name="alignLeft" />
        <Item name="alignCenter" />
        <Item name="alignRight" />
        <Item name="alignJustify" />
        <Item name="separator" />
        <Item name="orderedList" />
        <Item name="bulletList" />
        <Item name="separator" />
        <Item name="color" />
        <Item name="background" />
        <Item name="separator" />
        <Item name="link" />
        <Item name="separator" />
        <Item name="clear" />
        <Item name="codeBlock" />
        <Item name="blockquote" />
        <Item name="separator" />
        <Item name="insertTable" />
        <Item name="deleteTable" />
        <Item name="insertRowAbove" />
        <Item name="insertRowBelow" />
        <Item name="deleteRow" />
        <Item name="insertColumnLeft" />
        <Item name="insertColumnRight" />
        <Item name="deleteColumn" />
        <Item name="cellProperties" />
        <Item name="tableProperties" />
        <Item name="separator" />
        <Item name="separator" />
        <Item widget="dxButton" options={getToolbarButtonOptions} />
      </Toolbar>
    </HtmlEditor>
  </>
};

export default DxHtmlEditor;