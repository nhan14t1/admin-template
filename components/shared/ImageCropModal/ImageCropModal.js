import { Modal, Slider, Tabs } from 'antd';
import { useState } from 'react';
import classes from './Crop.module.scss';
import Cropper from 'react-easy-crop';
import getCroppedImg from './components/cropImageHelper';

const ImageCropModal = ({ base64, open, onDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedBase64, setCroppedBase64] = useState(null)

  const onCropComplete = (croppedArea, newCroppedAreaPixels) => {
    // Hack
    if (croppedBase64 && (isNaN(newCroppedAreaPixels.x) 
      || newCroppedAreaPixels.x == croppedAreaPixels.croppedAreaPixels && newCroppedAreaPixels.y == croppedAreaPixels.croppedAreaPixels)) {
      return;
    }
    setCroppedAreaPixels(newCroppedAreaPixels)
    doCrop(newCroppedAreaPixels);
  }

  const onCropChange = (newCrop) => {
    // Hack
    if (croppedBase64 && (!newCrop.x && !newCrop.y || newCrop.x == crop.x && newCrop.y == crop.y)) {
      return;
    }
    setCrop(newCrop);
  }

  const doCrop = async (croppedAreaPixels) => {
    try {
      const croppedBase64 = await getCroppedImg(
        base64,
        croppedAreaPixels,
        rotation
      )

      setCroppedBase64(croppedBase64);
    } catch (e) {
      console.log(e);
    }
  }

  const renderCrop = () => {
    return <>
      <div className={classes.cropContainer}>
        <Cropper
          image={base64}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={500 / 300}
          onCropChange={onCropChange}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className='row mt-3'>
        <div className='col-12 col-md-6 d-flex align-items-center'>
          Zoom

          <div style={{ width: 'calc(100% - 60px)' }}
            className='ms-auto'>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(zoom) => setZoom(zoom)}
            />
          </div>
        </div>

        <div className='col-12 col-md-6 d-flex align-items-center'>
          Xoay

          <div style={{ width: 'calc(100% - 60px)' }}
            className='ms-auto'>
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              onChange={(rotation) => setRotation(rotation)}
            />
          </div>

        </div>
      </div>
    </>
  }

  const renderPreview = () => {
    return <img src={croppedBase64} width={`100%`} />
  }

  const TABS = [
    {
      key: '1',
      label: 'Cắt',
      children: <>{renderCrop()}</>,
    },
    {
      key: '2',
      label: 'Xem trước',
      children: <>{renderPreview()}</>,
    },
  ];

  const handleOk = () => {
    onDone && onDone(croppedBase64);
  }

  return (
    <Modal title="Cắt ảnh" open={open} width={700} closeIcon={false} cancelText='Hủy'
      onOk={handleOk} onCancel={() => onCancel && onCancel()} maskClosable={false}>
      <div style={{ minHeight: '400px' }}>
        <Tabs defaultActiveKey="1" items={TABS} />
      </div>
    </Modal>
  )
}

export default ImageCropModal;