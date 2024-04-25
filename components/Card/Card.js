import { TEST_IMAGE_URL } from '../../shared/constants/app-const';
import styles from './Card.module.scss';
import PropTypes from 'prop-types';
import Image from 'next/legacy/image';

function Card({ title, headline, thumbnail, bgColor, isTopStory }) {
  return (
    <div className={styles.wrapper}>
      <figure className={styles.figure}>
        
        <Image className={styles.figure_img} src={thumbnail || TEST_IMAGE_URL} alt={title}
          width={600} height={360} />

        <figcaption className={styles.figcaption}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>

          <div className={styles.headline}>
            <p>{headline}</p>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  bgColor: PropTypes.string,
};

export default Card;
