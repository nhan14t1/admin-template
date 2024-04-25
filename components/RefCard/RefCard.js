import styles from './RefCard.module.scss';
import PropTypes from 'prop-types';

function RefCard({ title, headline, thumbnail, bgColor, isTopStory }) {
  const blankCard = () => {
    return (
      <div className={styles.fake}>
        <div className={styles.logo}></div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <figure className={`${styles.figure} ${isTopStory ? styles.figureTopStory : ''}`}>
        {thumbnail ? (
          <img className={styles.figure_img} src={thumbnail} alt={title} />
        ) : (
          blankCard()
        )}
        <figcaption className={styles.figcaption}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>

          <div className={styles.headline}>
            <p>{headline}</p>
          </div>
        </figcaption>
      </figure>
      <div
        className={styles.baseline}
        style={{ background: `${bgColor || '#d32f2f'}` }}
      ></div>
    </div>
  );
}

RefCard.propTypes = {
  title: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  bgColor: PropTypes.string,
};

export default RefCard;
