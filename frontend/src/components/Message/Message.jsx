import React from "react";

import styles from "./Message.module.css";

const Message = ({ type, msg }) => {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <p>{msg}</p>
    </div>
  );
};

export default Message;
