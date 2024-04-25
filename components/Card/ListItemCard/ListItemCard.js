import Image from 'next/legacy/image';
import styles from './ListItemCard.module.scss';
import PropTypes from 'prop-types';

function ListItemCard({ title, thumbnail }) {
  return (
    <div className={styles.wrapper}>
      <figure className={styles.figure}>
        <Image className={styles.figure_img} src={thumbnail} alt={title} width={100} height={60} />
        <figcaption className={styles.figcaption}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

ListItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
};

export default ListItemCard;
