import React from "react";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>ReactGram &copy; 2023</p>
      <p>
        Created by <a href="https://github.com/onurbeht">Bruno Oliveira</a>
      </p>
    </footer>
  );
};

export default Footer;
