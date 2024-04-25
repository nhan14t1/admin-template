import { faImages, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import ImageCropModal from '../../../shared/ImageCropModal/ImageCropModal';

const ThumbnailUpload = ({ image, onChange, ignoreCrop, onCropped, onCancelled }) => {
  const [showCrop, setShowCrop] = useState(false);
  const onImageChange = ([image]) => {
    onChange(image ? { base64: image.base64, name: image.file.name } : null);
    !ignoreCrop && image && setShowCrop(true);
  };

  const onCropDone = (croppedBase64) => {
    setShowCrop(false);
    onCropped(croppedBase64);
  }

  const onCropCancelled = () => {
    setShowCrop(false);
    onCancelled && onCancelled();
  }

  return (
    <>
      <ImageUploading
        value={image ? [image] : null}
        onChange={onImageChange}
        dataURLKey="base64"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="app-thumbnail-upload">
            <div className='thumbnails-preview'>
              {!imageList.length &&
                <div
                  style={isDragging ? { color: 'red' } : undefined}
                  className='drag-zone'
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <FontAwesomeIcon icon={faImages} />
                </div>
              }

              {imageList.map((image) => (
                <div key={`img-item`} className="image-item">
                  <img src={image['base64']} alt="" className='img-preview' onClick={onImageUpload} />
                  <span className='btn-remove' onClick={() => onImageRemove(0)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>

      {showCrop &&
        <ImageCropModal base64={image?.base64} open={showCrop}
          onDone={onCropDone} onCancel={onCropCancelled} />
      }
    </>
  );
}

export default ThumbnailUpload;