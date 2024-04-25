import { TEST_IMAGE_URL } from '../../../shared/constants/app-const';
import styles from './ImageCard.module.scss';
import PropTypes from 'prop-types';
import Image from 'next/legacy/image';

function ImageCard({ title, thumbnail, smallImage }) {
  return (
    <div className={`${styles.wrapper} ${smallImage ? styles.small_image : ''}`}>
      <div className={styles.figure}>
        
        <Image className={styles.figure_img} src={thumbnail || TEST_IMAGE_URL} alt={title}
          width={700} height={420} />

        <div className={styles.figcaption}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ImageCard.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  smallImage: PropTypes.bool,
};

export default ImageCard;
