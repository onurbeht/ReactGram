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

const Navbar = () => {
  return (
    <nav>
      <Link to="/">ReactGram</Link>
      <form>
        <BsSearch />
        <input type="text" />
      </form>
      <ul>
        <li>
          <NavLink to="/">
            <BsHouseDoorFill />
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">Entrar</NavLink>
        </li>
        <li>
          <NavLink to="/register">Cadastrar</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
