import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import SearchBar from '../../components/ui/SearchBar';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { DeleteConfirmModal } from '../../components/Modal/deleteModal';
import { useNavigate } from 'react-router-dom';
import {Modal} from '../../components/ui/modal';
import {  Pencil } from 'lucide-react';

interface District {
  districtId: string;
  name: string;
  createdAt: string;
}

const DistrictsTable = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<District | null>(null);
const navigate = useNavigate();
const [newDistrictName, setNewDistrictName] = useState('');
const [createError, setCreateError] = useState('');
const [showCreateModal, setShowCreateModal] = useState(false);
const [editDistrict, setEditDistrict] = useState<District | null>(null);
const [editDistrictName, setEditDistrictName] = useState('');
const [showEditModal, setShowEditModal] = useState(false);
const [updateError, setUpdateError] = useState('');




   const orgId = 'cfc16989-2d30-4273-8bd0-37cf913bdba6';
  const token = localStorage.getItem('token') || '';

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createDistricthandler= async() =>{
    if (!newDistrictName.trim()){
      setCreateError('district name is required');
      return;
    }
    setLoading(true);
    setCreateError('')
    try {
      const response =await fetch('http://192.168.1.17:8000/api/district/create',{
        method: 'POST',
        headers:{
          "content-Type": 'application/json',
          "authorization": `Bearear ${token}`,
        },
        body: JSON.stringify({
          orgId,
          name: newDistrictName
        })
      });
      if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || 'Failed to create district');
    }
    setShowCreateModal(false);
    setNewDistrictName('');
    setPage(1);
    // fetchDistricts();
    }
    catch (err) {
    setCreateError((err as Error).message);
  } finally {
    setLoading(false);
  }
}; 

  const fetchDistricts = useCallback(async () => {
    if (isSearchMode) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://192.168.1.17:8000/api/district/all?orgId=${orgId}&page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setDistricts(data.districts || []);
      setHasMore((data.districts || []).length === 10);
    } catch (err) {
      setError(`Failed to fetch districts: ${(err as Error).message}`);
      setDistricts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [orgId, token, page, isSearchMode]);

  useEffect(() => {
    // fetchDistricts();
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

const handleUpdateDistrict = async () => {
  if (!editDistrictName.trim()) {
    setUpdateError('District name is required');
    return;
  }

  if (!editDistrict) return;

  setLoading(true);
  setUpdateError('');
  try {
    const response = await fetch('http://192.168.1.17:8000/api/district/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orgId,
        districtId: editDistrict.districtId,
        name: editDistrictName,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || 'Failed to update district');
    }

    setShowEditModal(false);
    setEditDistrict(null);
    setPage(1);
    // isSearchMode ? performSearch(searchTerm) : fetchDistricts();
  } catch (err) {
    setUpdateError((err as Error).message);
  } finally {
    setLoading(false);
  }
};

useEffect(() =>{
  if(editDistrict){
    setEditDistrictName(editDistrict.name);
  setShowEditModal(true);

  }
  else{
    setEditDistrictName('');
  }
}, [editDistrict]);

  useEffect(() => {
    if (!isSearchMode) fetchDistricts();
  }, [page, fetchDistricts, isSearchMode]);

  const performSearch = useCallback(async (searchValue: string) => {
    if (!searchValue.trim()) {
      setIsSearchMode(false);
      setPage(1);
      fetchDistricts();
      return;
    }

    setIsSearchMode(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://192.168.1.17:8000/api/district/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orgId, search_term: searchValue }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDistricts(data.results || []);
      setHasMore(false);
    } catch (err) {
      setError(`Search failed: ${(err as Error).message}`);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, token, fetchDistricts]);

  const handleInputChange = (value: string): void => {
    setSearchTerm(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => performSearch(value), 500);
  };

  const handleSearch = (e?: React.MouseEvent | React.KeyboardEvent): void => {
    if (e) e.preventDefault();
    performSearch(searchTerm);
  };

  const deleteDistrict = async () => {
    if (!districtToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.1.17:8000/api/district/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId,
          districtId: districtToDelete.districtId,
          districtName: districtToDelete.name,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      isSearchMode ? performSearch(searchTerm) : fetchDistricts();
    } catch (err) {
      setError(`Failed to delete district: ${(err as Error).message}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
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

  const TableView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      
      <div className="flex justify-end items-center mb-4 px-4 pt-4">
        <div className="flex items-center space-x-2 px-3">
         <Button
  variant="primary"
  onClick={() => setShowCreateModal(true)}
  
>
  + Add District
</Button>
</div>
        <SearchBar
          placeholder="Search by district "
          value={searchTerm}
          onChange={handleInputChange}
          loading={loading}
          onSearch={handleSearch}
          searchbtn={true}
        />
      </div>
     
      <div className="overflow-x-auto">
     <Table className="w-[600px] border border-gray-200 rounded-md overflow-hidden text-sm">
  <TableHeader className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
    <TableRow>
      <TableHead className="px-4 py-3 text-left">District Name</TableHead>
      <TableHead className="px-4 py-3 text-left">District ID</TableHead>
      <TableHead className="px-4 py-3 text-left">Created</TableHead>
      <TableHead className="px-4 py-3 text-left">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {loading ? (
      <TableRow>
        <td colSpan={4} className="text-center py-6">Loading...</td>
      </TableRow>
    ) : error ? (
      <TableRow>
        <td colSpan={4} className="text-center py-6 text-red-500">{error}</td>
      </TableRow>
    ) : districts.length === 0 ? (
      <TableRow>
        <td colSpan={4} className="text-center py-6">No districts found.</td>
      </TableRow>
    ) : (
      districts.map((district) => (
        <TableRow
          key={district.districtId}
          onClick={() => navigate(`/constituencies?districtId=${district.districtId}`)}
          className="cursor-pointer hover:bg-gray-50 transition"
        >
          <td className="px-4 py-3 max-w-xs truncate">{district.name}</td>
          <td className="px-4 py-3 font-mono">{district.districtId}</td>
          <td className="px-4 py-3">{formatDate(district.createdAt)}</td>
          <td className="px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              // onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              //   e.stopPropagation();
              //   setDistrictToDelete(district);
              //   setShowDeleteModal(true);
              // }}

              onClick={(e:any) => {
                e.stopPropagation();
                setDistrictToDelete(district);
                setShowDeleteModal(true);
              }}  
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
  variant="ghost"
  size="sm"
  onClick={(e:any) => {
  e.stopPropagation();
    setEditDistrict(district);
    setEditDistrictName(district.name);
    setUpdateError('');
    setShowEditModal(true);
  }}
  className="text-blue-600 hover:text-blue-800 mr-1"
>
  <Pencil className="w-4 h-4" />
</Button>

          </td>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>

      </div>
    </div>
  );

  const CardsView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {districts.map((district) => (
        <div
  key={district.districtId}
  onClick={() => navigate(`/constituencies?districtId=${district.districtId}`)}
  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
>
  <Button
  variant="ghost"
  size="sm"
  onClick={(e:any) => {
    e.stopPropagation();
    setEditDistrict(district);
    setEditDistrictName(district.name);
    setUpdateError('');
    setShowEditModal(true);
  }}
  className="text-blue-600 hover:text-blue-800 mr-1"
>
  <Pencil className="w-4 h-4" />
</Button>

          <h3 className="text-lg font-semibold">{district.name}</h3>
          <p className="text-sm text-gray-500">ID: <span className="font-mono">{district.districtId}</span></p>
          <p className="text-sm text-gray-500">Created: {formatDate(district.createdAt)}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e:any) => {
              e.stopPropagation();
              setDistrictToDelete(district);
              setShowDeleteModal(true);
            }}
            className="text-red-600 hover:text-red-800 mt-2"
          >
            <Trash2 className="w-4 h-4 flex-row-end items-center justify-end" /> 
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Districts</h1>
          <p className="text-gray-600">Manage and view all districts</p>
        </div>
        <div className="flex gap-4">
          <div className="flex border p-1 bg-white rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cards
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading || isSearchMode}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || loading || isSearchMode}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? TableView()  : CardsView() }

      <div className="text-sm text-gray-500 flex justify-between">
        <span>{isSearchMode ? 'Search Results' : `Page ${page}`}</span>
        <span>{districts.length} district(s) shown</span>
      </div>
{showCreateModal && (
  <Modal className='max-w-2/5 max-h-1/2' isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
    <div className="p-6 max-w-md mx-auto w-full">
      <h2 className="text-xl font-semibold mb-4">Create New District</h2>

      <input
        type="text"
        value={newDistrictName}
        onChange={(e) => setNewDistrictName(e.target.value)}
        placeholder="Enter district name"
        className="w-full border border-gray-300 px-3 py-2 rounded mb-3"
      />

      {createError && <p className="text-red-500 mb-2">{createError}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={createDistricthandler}>
          Create
        </Button>
      </div>
    </div>
  </Modal>
)}

{showEditModal && (
  <Modal  className='max-w-2/5 max-h-1/2' isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
    <div className="p-6 max-w-md mx-auto w-full">
      <h2 className="text-xl font-semibold mb-4">Edit District</h2>

      <input
        type="text"
        value={editDistrictName}
        onChange={(e) => setEditDistrictName(e.target.value)}
        placeholder="Enter district name"
        className="w-full border border-gray-300 px-3 py-2 rounded mb-3"
      />

      {updateError && <p className="text-red-500 mb-2">{updateError}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setShowEditModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdateDistrict}>
          Save
        </Button>
      </div>
    </div>
  </Modal>
)}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteDistrict}
        itemName={districtToDelete?.name}
        isLoading={loading}
        title="Delete District"
      />
    </div>
  );
};

export default DistrictsTable;
