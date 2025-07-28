import React, { useState, useEffect } from 'react';
import Blank from '../../components/ui/Blank';
import SearchBar from '../../components/ui/SearchBar';
import UserTable from '../../components/User/UserTable';
import Pagination from '../../components/common/Pagination';
import CreateOrganizationModal from '../../components/Organization/orgModal';
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../../context/appContext';
import { useLogOut } from '../../hooks/useLogOut';
import { toast } from 'react-toastify'
import EditOrganizationModal from '../../components/orgById/editOrgModal';

export type Organization = {
  orgId: string;
  orgName: string;
  orgEmail?: string;
  orgStatus: string;
  orgLogo?: string;
};
export type OrganizationCreation = {
  orgName: string;
  orgEmail?: string;
  orgLogo?: string;
};

const Organization: React.FC = () => {
  const navigation = useNavigate();
  const { URL } = useAppContext();
  const logOut = useLogOut();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchAllOrgs = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}org/getAllOrg?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("Fetched Organizations:", data);
        setOrganizations(data.organizations || []);
        setTotalPages(Math.ceil(data.total / limit));
      } else if (response.status === 401 || response.status === 403) {
        console.log('Unauthorized access. Logging out...');
        logOut();
      } else {
        toast.error('Failed to fetch organizations');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    const trimmedTerm = searchTerm.trim().toLowerCase();
    setLoading(true);
    setError('');
    console.log("Search Term:", trimmedTerm);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const response = await fetch(`${URL}org/searchOrg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ searchTerm: trimmedTerm }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("Search Results:", data);
        setOrganizations(Array.isArray(data.results) ? data.results : []);
      } else if (response.status === 401 || response.status === 403) {
        toast.error('Unauthorized access. Logging out...');
        logOut();
      } else {
        toast.error(`Organization Not Found`);
      }
      // setCurrentPage(1);
      // setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      toast.error('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    }
    else {
      fetchAllOrgs(currentPage, itemsPerPage);
    }
  }, [statusFilter, currentPage]);


  useEffect(() => {
    const filtered = statusFilter === 'ALL'
      ? organizations
      : organizations.filter(org => org.orgStatus === statusFilter);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [organizations, statusFilter]);


  const handleInputChange = (value: string): void => {
    setSearchTerm(value);
    if (!value.trim()) {
      fetchAllOrgs(1, itemsPerPage);
    }
  };

  const handleCreateOrganization = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (newOrg: Omit<OrganizationCreation, 'orgId'>): Promise<void> => {
    console.log('Creating organization:', newOrg);
    fetchAllOrgs(currentPage, itemsPerPage);
  };

  const handleToggleStatus = async (orgId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.orgId === orgId ? { ...org, orgStatus: newStatus } : org
      )
    );
    try {
      const response = await fetch(`${URL}org/updateOrg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ orgId, orgStatus: newStatus }),
      });

      if (response.status === 200) {
        toast.success(`Organization status updated to ${newStatus}`);
        fetchAllOrgs(currentPage, itemsPerPage);
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to create organization');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  // const paginatedData = organizations.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );
  const filteredOrganizations = statusFilter === 'ALL'
    ? organizations
    : organizations.filter(org => org.orgStatus === statusFilter);

  const paginatedData = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (
    <Blank title="Organization">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor your organization</p>
      </div>

      <div className="flex justify-end gap-4">
        <div className="w-[420px] mr-4">
          <SearchBar
            value={searchTerm}
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="Search by Organization ID or Name..."
            searchbtn={true}
            loading={loading}
            bodycls='w-110'
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
          className="border px-3 py-2 rounded-md text-sm text-gray-700"
        >
          <option value="ALL">ALL</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
          onClick={handleCreateOrganization}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Create Organization
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <UserTable orgData={paginatedData} onToggleStatus={handleToggleStatus} />

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxVisiblePages={5}
        />
      )}

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

    </Blank>
  );
};




export default Organization;
