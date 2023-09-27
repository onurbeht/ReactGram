import styles from "./photoItem.module.css";

import { uploads } from "../../utils/config";

import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
  return (
    <div className={styles.photo_item}>
      {photo.image && (
        <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <div className={styles.photo_author}>
        <Link to={`/users/${photo.userId}`}>{photo.userName}</Link>
        <h4>{photo.title}</h4>
      </div>
    </div>
  );
};

export default PhotoItem;
