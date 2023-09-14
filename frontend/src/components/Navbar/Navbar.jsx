import React from "react";

import styles from "./Navbar.module.css";

//Components
import { NavLink, Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsSearch,
  BsFillPersonFill,
  BsFillCameraFill,
} from "react-icons/bs";

//Hooks
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Redux
import { logout, reset } from "../../slices/authSlice";

const Navbar = () => {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.title}>
        ReactGram
      </Link>
      <form className={styles.searchForm}>
        <BsSearch />
        <input type="text" />
      </form>
      <ul className={styles.links}>
        {auth ? (
          <>
            <li>
              <NavLink to="/">
                <BsHouseDoorFill />
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to={`/users/${user._id}`}>
                  <BsFillCameraFill />
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/profile">
                <BsFillPersonFill />
              </NavLink>
            </li>

            <li>
              <span onClick={handleLogout}>Sair</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Entrar</NavLink>
            </li>
            <li>
              <NavLink to="/register">Cadastrar</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
