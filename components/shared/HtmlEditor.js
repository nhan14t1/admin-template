"use client"
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from "quill-image-uploader";
import { useMemo } from 'react';
import { postFile } from '../../shared/utils/apiUtils';
import { BASE_IMAGE_URL } from '../../shared/constants/app-const';
import { compressFile } from '../../shared/utils/imageCompressUtils';

import 'react-quill/dist/quill.snow.css';

Quill.register("modules/imageUploader", ImageUploader);

const HtmlEditor = ({onChange, value, onImageInsertedDeleted}) => {
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
    'color',
    'background',
    'align',
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ color: [] }],
      [{ background: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      ["link", "image"],
      ["clean"],
    ],
    imageUploader: {
      upload: async (file) => {
        const compressedFile = await compressFile(file, 0.3, 1200);

        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", new File([compressedFile], file.name));

          postFile('/admin/file/image', formData)
            .then((result) => {
              let url = `${BASE_IMAGE_URL}/${result.data.name}`;
              resolve(url);
            })
            .catch((error) => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      }
    }
  }

  const moduleMemo = useMemo(() => modules, [])
  const formatMemo = useMemo(() => formats, [])

  const onEditorChange = (html, delta) => {
    onChange(html);

    if (delta?.ops?.[1]?.insert?.image || delta?.ops?.[1]?.delete) {
      onImageInsertedDeleted && onImageInsertedDeleted(html);
    }
  }

  return (
    <ReactQuill
      key="quill-html"
      onChange={(html, delta, source) => {source == 'user' && onEditorChange(html, delta)}}
      theme="snow"
      className='quill-editor app-content'
      modules={moduleMemo}
      formats={formatMemo}
      value={value}
    />
  );
}

export default HtmlEditor;