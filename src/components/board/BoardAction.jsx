import React from "react";
import Button from "../ui/Button.jsx";
import styles from "./BoardAction.module.css";
import { useNavigate } from "react-router-dom";

const BoardAction = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.boardAction}>
      <Button
        label="게시글 작성"
        type="button"
        onClick={() => navigate("/post-upload")}
        className={styles.btnSubmit}
      />
    </div>
  );
};

export default BoardAction;