//CSS
import styles from "./EditProfile.module.css";

import { uploads } from "../../utils/config";

//Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { resetMessage, profile, updateProfile } from "../../slices/userSlice";

//Components
import Message from "../../components/Message/Message";

const EditProfile = () => {
  const dispatch = useDispatch();

  const { user, loading, error, message } = useSelector((state) => state.user);

  //states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  //Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  //Fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }
    if (password) {
      userData.password = password;
    }

    //build form data
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleImage = (e) => {
    //Image preview
    const image = e.target.files[0];

    setPreviewImage(image);

    //update Image state
    setProfileImage(image);
  };

  return (
    <div className={styles.container}>
      <h2>Edite seus dados</h2>
      <p className={styles.subtitle}>
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>

      {(user.profileImage || previewImage) && (
        <img
          className={styles.profile_img}
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="email" placeholder="E-mail" disabled value={email || ""} />
        <label>
          <span>Imagem do perfil:</span>
          <input type="file" onChange={handleImage} />
        </label>
        <label>
          <span>Bio:</span>
          <input
            type="text"
            placeholder="Descrição do perfil"
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label>
          <span>Quer alterar sua senha?</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {!loading ? (
          <input type="submit" value="Atualizar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <Message type={"error"} msg={error} />}
        {message && <Message type={"success"} msg={message} />}
      </form>
    </div>
  );
};

export default EditProfile;
