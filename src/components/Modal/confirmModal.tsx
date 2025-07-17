import React from 'react';
import { Modal } from '../ui/modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onCancel}
        className="max-w-md mx-auto"
        showCloseButton={false}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
