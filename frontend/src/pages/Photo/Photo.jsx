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
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

//Redux
import { getPhoto, likePhoto, commentPhoto } from "../../slices/photoSlice";

const Photo = () => {
  const [commentText, setCommentText] = useState("");

  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { loading, error, photo, message } = useSelector(
    (state) => state.photo
  );

  //Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  //Like
  const handleLike = () => {
    dispatch(likePhoto(photo._id));

    resetMessage();
  };

  //Comment
  const handleComment = (e) => {
    e.preventDefault();
    console.log("enviado");

    const commentData = {
      comment: commentText,
      id: photo._id,
    };

    dispatch(commentPhoto(commentData));

    setCommentText("");

    resetMessage();
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
      <div className={styles.message_container}>
        {error && <Message type="error" msg={error} />}
        {message && <Message type="success" msg={message} />}
      </div>

      <div className={styles.comments}>
        <h3>{photo.comments && photo.comments.length} Comentários</h3>
        <form onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Insira seu comentário..."
            minLength={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <input type="submit" value="Enviar" />
        </form>
        {photo.comments && photo.comments.length === 0 && (
          <p>Não há comentários nessa foto!</p>
        )}
        {photo.comments &&
          photo.comments.map((comment) => (
            <div key={comment.comment}>
              <div className={styles.author}>
                {comment.userImage && (
                  <img
                    src={`${uploads}/users/${comment.userImage}`}
                    alt={comment.userName}
                  />
                )}
                <Link to={`/users/${comment.userId}`}>{comment.userName}</Link>
              </div>
              <p>{comment.comment}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Photo;
