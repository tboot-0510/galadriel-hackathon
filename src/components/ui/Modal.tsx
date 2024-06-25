"use client";

import React, { useEffect, useLayoutEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { useModalContext } from "@/context/ModalProvider";

const Modal = () => {
  const { modalOpened, closeModal, modalProps } = useModalContext();

  const { title, contentElement } = modalProps;

  const moutingPoint = useMemo(() => document?.createElement("div"), []);

  useLayoutEffect(() => {
    if (modalOpened) {
      document?.body.appendChild(moutingPoint);
      return () => {
        document?.body.removeChild(moutingPoint);
      };
    }
  }, [modalOpened, moutingPoint]);

  const onCloseModal = (e: any) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  const handleBackdropClick = (event: any) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    document?.addEventListener("keydown", onCloseModal);
    return () => {
      document?.removeEventListener("keydown", onCloseModal);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!modalOpened || !moutingPoint) {
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <>
          <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
            onClick={handleBackdropClick}
          >
            <div className="bg-white m-auto p-8">
              <div className="flex flex-col items-center">{contentElement}</div>
            </div>
          </dialog>
        </>,
        moutingPoint
      )}
    </>
  );
};

export default Modal;
