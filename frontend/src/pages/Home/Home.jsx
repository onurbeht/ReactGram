//CSS
import styles from "./Home.module.css";

//Components
import Like from "../../components/Like/Like";
import PhotoItem from "../../components/PhotoItem/PhotoItem";
import Message from "../../components/Message/Message";

//Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//Redux
import { getAllPhotos, likePhoto } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { loading, error, photos } = useSelector((state) => state.photo);

  //Load all  photos
  useEffect(() => {
    dispatch(getAllPhotos());
  }, [dispatch, user]);

  //Like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  //console.log(photos);

  return (
    <div className={styles.home_container}>
      {photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <Like photo={photo} user={user} handleLike={handleLike} />
            <Link
              className={`btn ${styles.btn_home}`}
              to={`/photos/${photo._id}`}
            >
              Ver mais
            </Link>
          </div>
        ))}
      {photos && photos.length === 0 && (
        <h2 className={styles.no_photos}>
          {" "}
          Ainda ná ha fotos publicadas.{" "}
          <Link to={`/users/${user._id}`}>Publicar</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
