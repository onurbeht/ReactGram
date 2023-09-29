import styles from "./Search.module.css";

// hooks
import { useQuery } from "../../hooks/useQuery";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//Components
import PhotoItem from "../../components/PhotoItem/PhotoItem";
import Like from "../../components/Like/Like";

//Redux
import { likePhoto, searchPhotos } from "../../slices/photoSlice";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { loading, error, photos } = useSelector((state) => state.photo);

  //Load photos
  useEffect(() => {
    dispatch(searchPhotos(search));
  }, [dispatch, search]);

  //Like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.search_container}>
      <h2>Você está buscando por: {search}</h2>
      {photos && photos.errors ? (
        <p>Não foram encontrados resultados para sua busca...</p>
      ) : (
        photos &&
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <Like photo={photo} user={user} handleLike={handleLike} />
            <Link
              className={`btn ${styles.btn_search}`}
              to={`/photos/${photo._id}`}
            >
              Ver mais
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Search;
