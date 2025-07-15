import { useState } from 'react';

const useTableModals = <T,>() => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeElement, setActiveElement] = useState<T | null>(null);

  return {
    isDeleteModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    activeElement,
    setActiveElement,
  };
};

export default useTableModals;
