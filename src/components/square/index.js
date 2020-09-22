import React from "react";
import styles from "./square.module.css";

const Square = ({ squareClicked, squareList, id }) => {
  return (
    <div className={styles["square-box"]} onClick={() => squareClicked(id)}>
      Square
      <div>{squareList[id]}</div>
    </div>
  );
};

export default Square;
