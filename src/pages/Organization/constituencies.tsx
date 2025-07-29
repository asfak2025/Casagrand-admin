import React, { useState, useEffect } from 'react';
import Blank from '../../components/ui/Blank';
import SearchBar from '../../components/ui/SearchBar';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '../../components/ui/table';
import Pagination from '../../components/common/Pagination';
import { useLocation } from "react-router-dom";
import { useLogOut } from '../../hooks/useLogOut';
import { toast } from 'react-toastify';
import { Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/modal';

interface Member {
  memberId?: string;
  memberName: string;
  memberPosition: string;
}

interface Constituency {
  constituencyId: string;
  constituencyName: string;
  createdAt: string;
  constituencyMembers?: Member[];
}

const Constituency: React.FC = () => {
  const location = useLocation();
  const { state } = location;
  const { districtId, districtName } = state || {};
  const logOut = useLogOut();

  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingConstituency, setEditingConstituency] = useState<Constituency | null>(null);
  const [isFetchingConstituency, setIsFetchingConstituency] = useState(false);

  // Form states
  const [constituencyName, setConstituencyName] = useState('');
  const [members, setMembers] = useState<Member[]>([{ memberName: '', memberPosition: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConstituencies = async (page: number, limit: number) => {
    if (!districtId) {
      toast.error('District ID is missing');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/getAll-constituency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          page,
          limit
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setConstituencies(data.constituencies || []);
        setTotalPages(Math.ceil(data.total / limit));
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to fetch constituencies');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConstituencyById = async (constituencyId: string) => {
    if (!districtId || !constituencyId) return;

    setIsFetchingConstituency(true);
    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/getById-constituency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          constituencyId
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to fetch constituency details');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsFetchingConstituency(false);
    }
  };

  const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    const trimmedTerm = searchTerm.trim().toLowerCase();
    setLoading(true);
    setError('');

    try {
      const normalizedTerm = trimmedTerm.startsWith('cn_') 
        ? trimmedTerm.toUpperCase() 
        : trimmedTerm;

      const payload = districtId 
        ? { 
            orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
            districtId,
            searchText: normalizedTerm
          }
        : {
            orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
            searchText: normalizedTerm
          };

      const response = await fetch(`http://192.168.1.25:8000/api/district/search-constituency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const data = await response.json();
        setConstituencies(data.constituencies || []);
        setCurrentPage(1);
        setTotalPages(1);
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Constituency not found');
      }
    } catch (err) {
      toast.error(`Search failed.${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      fetchConstituencies(currentPage, itemsPerPage);
    }
  }, [currentPage]);

  const handleInputChange = (value: string): void => {
    setSearchTerm(value);
    if (!value.trim()) {
      fetchConstituencies(1, itemsPerPage);
    }
  };

  const handleAddMember = () => {
    setMembers([...members, { memberName: '', memberPosition: '' }]);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const resetForm = () => {
    setConstituencyName('');
    setMembers([{ memberName: '', memberPosition: '' }]);
  };

  const handleCreateSubmit = async () => {
    if (!constituencyName.trim()) {
      toast.error('Constituency name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/create-constituencies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          constituencyName: constituencyName,
          constituencyMembers: members.filter(m => m.memberName.trim() && m.memberPosition.trim())
        }),
      });

      if (response.status === 200) {
        toast.success('Constituency created successfully');
        fetchConstituencies(currentPage, itemsPerPage);
        setIsCreateModalOpen(false);
        resetForm();
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to create constituency');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = async (constituency: Constituency) => {
    try {
      const constituencyData = await fetchConstituencyById(constituency.constituencyId);
      if (constituencyData) {
        setEditingConstituency(constituencyData);
        setConstituencyName(constituencyData.constituencyName);
        setMembers(
          constituencyData.constituencyMembers?.length 
            ? constituencyData.constituencyMembers 
            : [{ memberName: '', memberPosition: '' }]
        );
      }
    } catch (err) {
      console.error('Error loading constituency details:', err);
      toast.error('Failed to load constituency details');
    }
  };

  const handleEditSubmit = async () => {
    if (!constituencyName.trim() || !editingConstituency) {
      toast.error('Constituency name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/update-constituencies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          constituencyId: editingConstituency.constituencyId,
          constituencyName: constituencyName,
          constituencyMembers: members
            .filter(m => m.memberName.trim() && m.memberPosition.trim())
            .map(m => ({
              memberId: m.memberId,
              memberName: m.memberName.trim(),
              memberPosition: m.memberPosition.trim()
            }))
        }),
      });

      if (response.status === 200) {
        toast.success('Constituency updated successfully');
        fetchConstituencies(currentPage, itemsPerPage);
        setEditingConstituency(null);
        resetForm();
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to update constituency');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConstituency = async (constituencyId: string) => {
    if (!window.confirm('Are you sure you want to delete this constituency?')) {
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/delete-constituency`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          constituencyId
        }),
      });

      if (response.status === 200) {
        toast.success('Constituency deleted successfully');
        fetchConstituencies(currentPage, itemsPerPage);
      } else if (response.status === 401 || response.status === 403) {
        logOut();
      } else {
        toast.error('Failed to delete constituency');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const paginatedData = constituencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Blank title="Constituency">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {districtName ? `${districtName} Constituencies` : 'Constituency Management'}
        </h1>
        <p className="text-gray-600 mt-2">Manage and monitor constituencies in this district</p>
      </div>

      <div className="flex justify-end gap-4">
        <div className="w-[420px] mr-4">
          <SearchBar
            value={searchTerm}
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="Search by Constituency Name or ID..."
            searchbtn={true}
            loading={loading}
            bodycls='w-110'
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreateModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Create Constituency
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Constituency Name</TableHead>
              <TableHead>Constituency ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">Loading...</TableCell>
              </TableRow>
            ) : constituencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  {searchTerm ? 'No matching constituencies found' : 'No constituencies available'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((constituency) => (
                <TableRow key={constituency.constituencyId} className="hover:bg-gray-50">
                  <TableCell>{constituency.constituencyName}</TableCell>
                  <TableCell className="font-mono text-sm">{constituency.constituencyId}</TableCell>
                  <TableCell>{formatDate(constituency.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(constituency)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                        disabled={isFetchingConstituency}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteConstituency(constituency.constituencyId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxVisiblePages={5}
        />
      )}

      {/* Create Constituency Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        className="max-w-md"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Constituency</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Constituency Name*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={constituencyName}
                onChange={(e) => setConstituencyName(e.target.value)}
                placeholder="Enter constituency name"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Members</label>
              {members.map((member, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-end mb-2">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      value={member.memberName}
                      onChange={(e) => handleMemberChange(index, 'memberName', e.target.value)}
                      placeholder="Member name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Position</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        value={member.memberPosition}
                        onChange={(e) => handleMemberChange(index, 'memberPosition', e.target.value)}
                        placeholder="Member position"
                      />
                      <button
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => handleRemoveMember(index)}
                        disabled={members.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-2"
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCreateSubmit}
                disabled={isSubmitting || !constituencyName.trim()}
              >
                {isSubmitting ? 'Creating...' : 'Create Constituency'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Constituency Modal */}
      <Modal
        isOpen={!!editingConstituency}
        onClose={() => {
          setEditingConstituency(null);
          resetForm();
        }}
        className="max-w-md"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Constituency</h2>
          {isFetchingConstituency ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Constituency Name*</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={constituencyName}
                    onChange={(e) => setConstituencyName(e.target.value)}
                    placeholder="Enter constituency name"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Members</label>
                  {members.map((member, index) => (
                    <div key={member.memberId || index} className="grid grid-cols-2 gap-4 items-end mb-2">
                      <div>
                        <label className="block mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={member.memberName}
                          onChange={(e) => handleMemberChange(index, 'memberName', e.target.value)}
                          placeholder="Member name"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Position</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            value={member.memberPosition}
                            onChange={(e) => handleMemberChange(index, 'memberPosition', e.target.value)}
                            placeholder="Member position"
                          />
                          <button
                            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => handleRemoveMember(index)}
                            disabled={members.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {member.memberId && (
                        <input type="hidden" name={`members[${index}].memberId`} value={member.memberId} />
                      )}
                    </div>
                  ))}
                  <button
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-2"
                    onClick={handleAddMember}
                  >
                    Add Member
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => {
                      setEditingConstituency(null);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleEditSubmit}
                    disabled={isSubmitting || !constituencyName.trim()}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Constituency'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </Blank>
  );
};

export default Constituency;