import React from "react";
import styles from "./square.module.css";

const Square = ({ squareClicked, squareList, id }) => {
  return (
    <div className={styles["square-box"]} onClick={() => squareClicked(id)}>
      {squareList[id]}
    </div>
  );
};

export default Square;
