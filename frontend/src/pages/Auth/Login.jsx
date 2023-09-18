//CSS
import styles from "./Auth.module.css";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//Components
import Message from "../../components/Message/Message";

//Redux
import { reset, login } from "../../slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const user = {
    email,
    password,
  };

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(login(user));
  };

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <section className={styles.form_container}>
      <h2>ReactGram</h2>
      <p className={styles.subtitle}>Faça o login para ver o que há de novo</p>
      <form onSubmit={handleLogin} className={styles.form}>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="Insira seu email"
            required={true}
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha</span>
          <input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            minLength={6}
            required={true}
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {!loading ? (
          <input type="submit" value="Entrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <Message type={"error"} msg={error} />}
      </form>
      <p className={styles.subtitle}>
        Não tem uma conta? <Link to="/register">Criar conta</Link>
      </p>
    </section>
  );
};

export default Login;
