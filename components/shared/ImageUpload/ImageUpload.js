import { faImages, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import ImageCropModal from '../ImageCropModal/ImageCropModal';

const ImageUpload = ({ images, onChange, onCropped, onCropCancelled, multiple }) => {
  const [randKey] = useState(Math.floor(Math.random() * 1000));
  const [showCrop, setShowCrop] = useState(false);
  const currentImages = images ? images[images.length - 1] : null;
  const onImageChange = (newImages) => {
    const adding = (multiple && newImages.length > (images?.length || 0))
      || !multiple && newImages.length;
    onChange(newImages);
    adding && setShowCrop(true);
  };

  const onCropDone = (croppedBase64) => {
    setShowCrop(false);
    onCropped(croppedBase64);
  }

  const onCancellCrop = () => {
    setShowCrop(false);
    onCropCancelled && onCropCancelled();
  }

  return (
    <>
      <ImageUploading
        key={`imgUploading${randKey}`}
        value={images}
        onChange={onImageChange}
        dataURLKey="base64"
        multiple={multiple}
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
              {imageList.map((image, index) => (
                <div key={`img-item`} className="image-item">
                  <img src={image['base64']} alt="" className='img-preview' onClick={multiple ? () => {} : onImageUpload} />
                  <span className='btn-remove' onClick={() => onImageRemove(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </div>
              ))}

              {(multiple || !imageList?.length) &&
                <div
                  style={isDragging ? { color: 'red' } : undefined}
                  className='drag-zone'
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <FontAwesomeIcon icon={faImages} />
                </div>
              }
            </div>
          </div>
        )}
      </ImageUploading>

      {showCrop &&
        <ImageCropModal key={`imgCropModal${randKey}`} base64={currentImages?.base64}
          open={showCrop}
          onDone={onCropDone} onCancel={onCancellCrop} />
      }
    </>
  );
}

export default ImageUpload;