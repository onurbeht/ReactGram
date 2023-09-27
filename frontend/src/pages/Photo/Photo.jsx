import styles from "./Photo.module.css";

import { uploads } from "../../utils/config";

//Components
import Message from "../../components/Message/Message";
import PhotoItem from "../../components/PhotoItem/photoItem";

//Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

//Redux
import { getPhoto } from "../../slices/photoSlice";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, photo } = useSelector((state) => state.photo);

  //Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

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
    </div>
  );
};

export default Photo;
