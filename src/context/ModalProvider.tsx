"use client";
import React, { useContext, useMemo, useState, useCallback } from "react";

type ModalContextValue = {
  modalProps: ModalContextProps;
  modalOpened?: boolean;
  openModal: ({ title, contentElement, onClose }: any) => void;
  closeModal: () => void;
  updateModal: ({ title, contentElement, onClose }: any) => void;
};

const INITIAL_STATE = {
  title: "",
  contentElement: null,
  onClose: () => {},
  openModal: () => {},
  closeModal: () => {},
  updateModal: () => {},
};

type ModalContextProps = {
  contentElement: React.ReactNode;
  onClose: () => void | null;
  title: string;
};

const MODAL_CONTEXT = React.createContext<ModalContextValue>({
  modalOpened: false,
  modalProps: {
    title: "",
    contentElement: null,
    onClose: () => {},
  },
  openModal: () => {},
  closeModal: () => {},
  updateModal: () => {},
});

const useModalContext = () => useContext(MODAL_CONTEXT);

const ModalProvider = ({ children }: any) => {
  const [modalProps, setModalProps] =
    useState<ModalContextProps>(INITIAL_STATE);

  const openModal = useCallback(({ title, contentElement, onClose }: any) => {
    setModalProps({ title, contentElement, onClose });
  }, []);

  const closeModal = useCallback(() => {
    if (modalProps.onClose) return modalProps.onClose();
    setModalProps(INITIAL_STATE);
  }, [modalProps]);

  const updateModal = useCallback(
    (newProps: any) => {
      setModalProps({ ...modalProps, ...newProps });
    },
    [modalProps]
  );

  const value = useMemo(
    () => ({
      modalOpened: modalProps.contentElement !== null,
      openModal,
      updateModal,
      closeModal,
      modalProps,
    }),
    [modalProps, updateModal, openModal, closeModal]
  );

  return (
    <MODAL_CONTEXT.Provider value={value}>{children}</MODAL_CONTEXT.Provider>
  );
};

export { useModalContext };
export default ModalProvider;
