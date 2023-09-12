//CSS
import styles from "./Auth.module.css";

//Hooks
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { reset, register } from "../../slices/authSlice";

//Components
import Message from "../../components/Message/Message";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    dispatch(register(user));
  };

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <section className={styles.form_container}>
      <h2>ReactGram</h2>
      <p className={styles.subtitle}>
        Cadastre-se para ver as fotos dos seus amigos
      </p>
      <form onSubmit={handleRegister} className={styles.form}>
        <label>
          <span>Name</span>
          <input
            type="text"
            name="name"
            placeholder="Insira seu nome"
            minLength={3}
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="Insira seu email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha</span>
          <input
            type="password"
            name="password"
            placeholder="Crie sua senha"
            minLength={6}
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <span>Corfimar Senha</span>
          <input
            type="password"
            name="ConfirmPass"
            placeholder="Confirme sua senha"
            minLength={6}
            required={true}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </label>
        {!loading ? (
          <input type="submit" value="Cadastrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <Message type={"error"} msg={error} />}
      </form>
      <p className={styles.subtitle}>
        Já tem conta? <Link to="/Login">Entrar</Link>
      </p>
    </section>
  );
};

export default Register;
