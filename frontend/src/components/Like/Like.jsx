import styles from "./Like.module.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

const Like = ({ photo, user, handleLike }) => {
  console.log(photo.likes);
  console.log(user._id);
  return (
    <div className={styles.like_container}>
      {photo.likes && user && (
        <>
          {photo.likes.includes(user._id) ? (
            <BsHeartFill onClick={() => handleLike(photo)} />
          ) : (
            <BsHeart onClick={() => handleLike(photo)} />
          )}
          <p>{photo.likes.length} like(s)</p>
        </>
      )}
    </div>
  );
};

export default Like;
