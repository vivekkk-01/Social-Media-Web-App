import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./modal.module.css";

const Modal = ({ children }) => {
  return (
    <div className={classes.modal}>
      <div>{children}</div>
    </div>
  );
};

const Overlay = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose}></div>;
};
const ModalOverlay = ({ children, onClose }) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal>{children}</Modal>,
        document.getElementById("modal")
      )}
      {ReactDOM.createPortal(
        <Overlay onClose={onClose} />,
        document.getElementById("backdrop")
      )}
    </Fragment>
  );
};

export default ModalOverlay;
