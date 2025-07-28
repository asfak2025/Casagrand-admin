import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { toast } from 'react-toastify';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: 'overviewTab' | 'membersTab' | 'accessTab';
  initialData: any;
  onSubmit: (updatedData: any) => Promise<void>;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  isOpen,
  onClose,
  tab,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({ ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Organization updated successfully');
      onClose();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full p-6">
      <h2 className="text-xl font-bold mb-4">Edit Organization</h2>
      <form onSubmit={handleSubmit}>

        {tab === 'overviewTab' && (
          <>
            {/* Organization Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.orgName || ''}
                onChange={(e) => handleChange('orgName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organization name"
              />
            </div>

            {/* Organization Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Status
              </label>
              <select
                value={formData.orgStatus || 'ACTIVE'}
                onChange={(e) => handleChange('orgStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Organization Logo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                value={formData.orgLogo || ''}
                onChange={(e) => handleChange('orgLogo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter logo image URL"
              />
            </div>
          </>
        )}

        {tab === 'membersTab' && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Members tab content goes here.</p>
            {/* Add member editing form here */}
          </div>
        )}

        {tab === 'accessTab' && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm">Access tab content goes here.</p>
            {/* Add access permission toggles etc. */}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditOrganizationModal;
