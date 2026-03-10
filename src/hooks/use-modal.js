import { useState, useCallback } from 'react';

/**
 * 컴포넌트 내부에서 여러 개의 모달을 띄우고 닫을 때 사용하는 범용 훅
 * @returns { isOpen, openModal, closeModal, toggleModal }
 */
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
