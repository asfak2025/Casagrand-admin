import React, { useState } from 'react'; 
import { OrganizationCreation } from '../../pages/Organization/Organization ';
import { Modal } from '../ui/modal';
import { useAppContext } from '../../context/appContext';
import { toast } from 'react-toastify';
import { useLogOut } from '../../hooks/useLogOut';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (org: Omit<OrganizationCreation, 'orgId'>) => Promise<void>;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: '',
    orgLogo: '',
  });

  const [formErrors, setFormErrors] = useState({
    orgName: '',
    orgEmail: '',
  });

  const { URL } = useAppContext();
  const logOut = useLogOut();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setFormErrors({ orgName: '', orgEmail: '' });

    let hasError = false;
    const errors = { orgName: '', orgEmail: '' };

    if (!formData.orgName.trim()) {
      errors.orgName = 'Organization name is required';
      hasError = true;
    }

    if (!formData.orgEmail.trim()) {
      errors.orgEmail = 'Organization email is required';
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${URL}org/createorg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        toast.success('Organization created successfully');
        onClose();
        await onSubmit(formData);
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to create organization');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full p-6">
      <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
      <form onSubmit={handleSubmit}>
        {/* Organization Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            value={formData.orgName}
            onChange={(e) =>
              setFormData({ ...formData, orgName: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              formErrors.orgName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter organization name"
          />
          {formErrors.orgName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.orgName}</p>
          )}
        </div>

        {/* Organization Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Email
          </label>
          <input
            type="email"
            value={formData.orgEmail}
            onChange={(e) =>
              setFormData({ ...formData, orgEmail: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              formErrors.orgEmail ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter organization email"
          />
          {formErrors.orgEmail && (
            <p className="text-red-500 text-sm mt-1">{formErrors.orgEmail}</p>
          )}
        </div>

        {/* Logo URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            value={formData.orgLogo}
            onChange={(e) =>
              setFormData({ ...formData, orgLogo: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter logo image URL"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrganizationModal;
