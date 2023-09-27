import styles from "./Photo.module.css";

import { uploads } from "../../utils/config";

//Components
import Message from "../../components/Message/Message";
import PhotoItem from "../../components/PhotoItem/photoItem";
import Like from "../../components/Like/Like";

//Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

//Redux
import { getPhoto, likePhoto } from "../../slices/photoSlice";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, photo } = useSelector((state) => state.photo);

  //Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  //Like
  const handleLike = () => {
    dispatch(likePhoto(photo._id));
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (photo.errors && photo.errors[0]) {
    return (
      <div className={styles.error_container}>
        <p>Foto não encontrada</p>
        <Link to="/">Home</Link>
      </div>
    );
  }
  return (
    <div className={styles.photo_container}>
      <PhotoItem photo={photo} />
      <Like photo={photo} user={user} handleLike={handleLike} />
    </div>
  );
};

export default Photo;
