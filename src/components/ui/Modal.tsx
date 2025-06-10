import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[1000]'>
      {/* Kontainer Modal (REVISI DI SINI) */}
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md z-[1010] flex flex-col max-h-[90vh]'>
        {/* Header Modal (tetap) */}
        <div className='flex-shrink-0 flex justify-between items-center p-4 border-b'>
          <h3 className='text-lg font-bold text-gray-800'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Konten Modal (REVISI DI SINI) */}
        <div className='p-6 overflow-y-auto'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
