import styles from "./Profile.module.css";

import { uploads } from "../../utils/config";

//Components
import Message from "../../components/Message/Message";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

//Hooks
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  resetMessage,
  publishPhoto,
  getUserPhotos,
  deleteUserPhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  //new form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  //States
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  //Edit States
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");

  //Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const handleImage = (e) => {
    const image = e.target.files[0];

    //update Image state
    setImage(image);
  };

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image,
    };

    //Build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    await dispatch(publishPhoto(formData));

    await setTitle("");

    resetComponentMessage();
  };

  //Delete a photo
  const handleDelete = (id) => {
    dispatch(deleteUserPhoto(id));

    resetComponentMessage();
  };

  //Show or hide form
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  //Update a photo
  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponentMessage();
  };

  //Open edit form
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditTitle(photo.title);
    setEditImage(photo.image);
  };

  //Close edit form
  const handleCancelEdit = (e) => {
    hideOrShowForms();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div>
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div ref={newPhotoForm} className={styles.form_photo}>
            <h2>Compartilhe algum momento seu:</h2>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título para a foto:</span>
                <input
                  type="text"
                  minLength={1}
                  placeholder="Insira um título"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" required onChange={handleImage} />
              </label>
              {!loadingPhoto ? (
                <input type="submit" value="Postar" />
              ) : (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>
          <div ref={editPhotoForm} className={`hide ${styles.edit_photo}`}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                minLength={1}
                placeholder="Insira um título"
                required
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel_btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message type={"error"} msg={errorPhoto} />}
          {messagePhoto && <Message type={"success"} msg={messagePhoto} />}
        </>
      )}
      <h2>Fotos publicadas:</h2>
      <div className={styles.photo_container}>
        {photos &&
          photos.length > 0 &&
          photos.map((photo) => (
            <div key={photo._id} className={styles.photo}>
              {photo.image && (
                <img
                  src={`${uploads}/photos/${photo.image}`}
                  alt={photo.title}
                />
              )}
              {id === userAuth._id ? (
                <div className={styles.actions}>
                  <Link to={`/photos/${photo._id}`}>
                    <BsFillEyeFill />
                  </Link>
                  <BsPencilFill onClick={() => handleEdit(photo)} />
                  <BsXLg onClick={() => handleDelete(photo._id)} />
                </div>
              ) : (
                <Link className="btn" to={`/photos/${photo._id}`}>
                  Ver
                </Link>
              )}
            </div>
          ))}
        {photos && photos.length === 1 && <p>Ainda não há fotos publicadas.</p>}
      </div>
    </div>
  );
};

export default Profile;
