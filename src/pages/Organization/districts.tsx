
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
      console.log("Fetching districts for orgId:", orgId, "page:", page);
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

  const handleNavigateToConstituencies = (districtId: string) => {
  if (!districtId) {
    console.error('No districtId provided for navigation');
    return;
  }
  console.log('Navigating with districtId:', districtId); // Debug log
  // navigate(`/constituencies?districtId=${(districtId)}`);
    navigate(`/constituencies`, {
    state: {
      districtId:districtId
    }
  });
};

  const TableView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
        <div className="flex items-center space-x-3 px-3">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add District
          </Button>
        </div>
        <div className="w-80">
          <SearchBar
            placeholder="Search districts..."
            value={searchTerm}
            onChange={handleInputChange}
            loading={loading}
            onSearch={handleSearch}
            searchbtn={true}
          />
        </div>
      </div>
     
      <div className="overflow-x-auto px-6 pb-6">
        <Table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">
                District Name
              </TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">
                District ID
              </TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Created
              </TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </TableRow>
            ) : error ? (
              <TableRow>
                <td colSpan={4} className="text-center py-12 text-red-500 bg-red-50">{error}</td>
              </TableRow>
            ) : districts.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl text-gray-300">📍</div>
                    <span>No districts found</span>
                  </div>
                </td>
              </TableRow>
            ) : (
              districts.map((district, index) => (
                <TableRow
                  key={district.districtId}
                 onClick={() => handleNavigateToConstituencies(district.districtId)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    index !== districts.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-xs">
                      {district.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {district.districtId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(district.createdAt)}
                  </td>
                  <td className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditDistrict(district);
                          setEditDistrictName(district.name);
                          setUpdateError('');
                          setShowEditModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-all duration-150"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDistrictToDelete(district);
                          setShowDeleteModal(true);
                        }}  
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add District
          </Button>
        </div>
        <div className="w-80">
          <SearchBar
            placeholder="Search districts..."
            value={searchTerm}
            onChange={handleInputChange}
            loading={loading}
            onSearch={handleSearch}
            searchbtn={true}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            <span>Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      ) : districts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-6xl text-gray-300">📍</div>
            <span className="text-gray-500 text-lg">No districts found</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {districts.map((district) => (
            <div
              key={district.districtId}
              onClick={() => handleNavigateToConstituencies(district.districtId)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {district.name}
                  </h3>
                </div>
                <div 
                  className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditDistrict(district);
                      setEditDistrictName(district.name);
                      setUpdateError('');
                      setShowEditModal(true);
                    }}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-all duration-150"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDistrictToDelete(district);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-medium">ID:</span>
                  <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {district.districtId}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-medium">Created:</span>
                  <span className="text-sm text-gray-700">{formatDate(district.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Districts</h1>
              <p className="text-gray-600">Manage and view all districts in your organization</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    viewMode === 'table' 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    viewMode === 'cards' 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Cards
                </button>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading || isSearchMode}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore || loading || isSearchMode}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'table' ? TableView() : CardsView()}

        {/* Footer Stats */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500 px-1">
          <span className="font-medium">
            {isSearchMode ? 'Search Results' : `Page ${page}`}
          </span>
          <span>
            {districts.length} district{districts.length !== 1 ? 's' : ''} shown
          </span>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal className='max-w-md' isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New District</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District Name
                </label>
                <input
                  type="text"
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder="Enter district name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-150"
                />
              </div>

              {createError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {createError}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={createDistricthandler}
                className="px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Create District
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal className='max-w-md' isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit District</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District Name
                </label>
                <input
                  type="text"
                  value={editDistrictName}
                  onChange={(e) => setEditDistrictName(e.target.value)}
                  placeholder="Enter district name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-150"
                />
              </div>

              {updateError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {updateError}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpdateDistrict}
                className="px-6 py-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
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