import React, { useState, useEffect } from 'react';
import Blank from '../../components/ui/Blank';
import SearchBar from '../../components/ui/SearchBar';
import UserTable from '../../components/User/UserTable';
import Pagination from '../../components/common/Pagination';
import CreateOrganizationModal from '../../components/Organization/orgModal';

export type Organization = {
  orgId: string;
  orgName: string;
  orgStatus: string;
};

const initialData: Organization[] = [
  { orgId: "1234567890", orgName: "Casagrand", orgStatus: "ACTIVE" },
  { orgId: "1234567891", orgName: "TVK", orgStatus: "INACTIVE" },
];

const Organization: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const itemsPerPage = 10;

  const paginatedData = organizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(organizations.length / itemsPerPage);

  useEffect(() => {
    handleSearch();
    }, [statusFilter]);

  const handleSearch = async (
    e?: React.MouseEvent | React.KeyboardEvent
    ): Promise<void> => {
    if (e) e.preventDefault();

    const trimmedTerm = searchTerm.trim().toLowerCase();

    setLoading(true);
    setError('');

    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const filtered = initialData.filter((org) => {
        const matchesSearch =
            org.orgId.toLowerCase().includes(trimmedTerm) ||
            org.orgName.toLowerCase().includes(trimmedTerm);
        const matchesStatus =
            statusFilter === 'ALL' || org.orgStatus === statusFilter;

        return matchesSearch && matchesStatus;
        });

        setOrganizations(filtered);
        setCurrentPage(1);
    } catch (err) {
        setError('Search failed.');
    } finally {
        setLoading(false);
    }
    };


  const handleInputChange = (value: string): void => {
    setSearchTerm(value);
    if (!value.trim()) {
      setOrganizations(initialData);
      setError('');
      setCurrentPage(1);
    }
  };

  const handleCreateOrganization = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (
    newOrg: Omit<Organization, 'orgId'>
    ): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newId = Date.now().toString();
        const newOrganization: Organization = { orgId: newId, ...newOrg };
        const updated = [newOrganization, ...organizations];
        setOrganizations(updated);
        setIsCreateModalOpen(false);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to create organization.');
      }
    };

  const handleToggleStatus = (orgId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.orgId === orgId
          ? { ...org, orgStatus: newStatus }
          : org
      )
    );
  };




  return (
    <Blank title="Organization">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor your organization</p>
      </div>

      <div className="flex justify-end gap-4">
        <div className="w-[420px]">
            <SearchBar
            value={searchTerm}
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="Search by Organization ID or Name..."
            searchbtn={true}
            loading={loading}
            />
        </div>

        <select
            value={statusFilter}
            onChange={(e) => {
            setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
            handleSearch();
            }}
            className="border px-3 py-2 rounded-md text-sm text-gray-700"
        >
            <option value="ALL">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
            onClick={handleCreateOrganization}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
            Create Organization
        </button>
        </div>


      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      <UserTable 
        orgData={paginatedData} 
        onToggleStatus={handleToggleStatus} 
      />


      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxVisiblePages={5}
        />
      )}

      {/* Create Modal */}
        <CreateOrganizationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateSubmit}
        />
    </Blank>
  );
};



export default Organization;
