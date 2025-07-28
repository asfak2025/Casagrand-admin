// ApiKey.jsx - Main component
import React, { useState, useEffect } from 'react';
import Blank from '../../components/ui/Blank';
import { useAppContext } from '../../context/appContext';
import { useLogOut } from '../../hooks/useLogOut';
import ApiKeyTable from '../../components/ApiKey/ApiKeyTable';
import { apiService } from '../../components/ApiKey/ApiService';
import SearchBar from '../../components/ui/SearchBar';
import ApiKeyForm from '../../components/ApiKey/ApiKeyForm';
import { Modal } from '../../components/ui/modal/index';
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

type ApiKeyType = {
  apiName: string;
  apiDescription: string;
  apiKey: string;
  updated_at: string;
  apiExpiry: string;
  apiKeyStatus: string;
};

const ApiKey = () => {
  const { token } = useAppContext();
  const { URL } = useAppContext();
  const location = useLocation();
  const logOut = useLogOut();
  const [apiKeys, setApiKeys] = useState<ApiKeyType[]>([]);
  const [filteredApiKeys, setFilteredApiKeys] = useState<ApiKeyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(location.state?.orgId)
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
      const orgIdLocal = localStorage.getItem('orgId');
      if (orgIdLocal && !location.state && !location.state?.orgId) {
          console.log('Organization ID found:', orgIdLocal);
          setOrgId(orgIdLocal)
          setSearchTerm(orgIdLocal)
          fetchApiKeys(orgIdLocal);
      }
      if(orgId){
          setSearchTerm(orgId)
          // fetchApiKeys(orgId);
          // localStorage.setItem('orgId', orgId);
      }
  }, []);

  // Fetch all API keys
  const fetchApiKeys = async (query: string): Promise<void> => {
    console.log('Fetching API keys with query:', query);
    console.log('Token:', token);
    console.log('URL:', URL);
    try {
      setLoading(true);
      const res = await fetch(`${URL}users/getAPI/${query}`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          }
      }); 
      if (res.status === 200) {
        const data = await res.json();
        console.log('API keys fetched:', data.apiKeys);
        setApiKeys(data.apiKeys || []);
        setFilteredApiKeys(data.apiKeys || []);
      } else if (res.status === 401 || res.status === 403) {
          console.warn('Unauthorized access. Logging out...');
          logOut();
      } else {
          console.error(`Unexpected error: ${res.status}`);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete API key - Fixed to use apiName as identifier
  const handleDeleteApiKey = async (apiKey:string) => {
     console.log(orgId)
      try {

        const res = await fetch(`${URL}users/deleteAPI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId: orgId,
          apiKey:apiKey,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log('API key created successfully:', data);
        toast.success(data.message);
        fetchApiKeys(orgId ?? '')
      } else if (res.status === 401 || res.status === 403) {
         toast.error('Unauthorized access. Logging out...');
        logOut();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error(`Error creating API key: ${res.status}`, errorData);
        alert(`Failed to create API key: ${errorData.message || 'Unknown error'}`);
      }
        
        console.log(`API key  deleted successfully`);
      } catch (error) {
        console.error('Error deleting API key:', error);
      }
  };

  // Create API key - Fixed to match your data structure
  const handleCreateApiKey = async (formData: { 
    orgId: string,
    name: string; 
    description: string; 
    expiryDate: string 
  }) => {
    try {
      setIsCreating(true);

      const res = await fetch(`${URL}users/createAPI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId: orgId,
          apiName: formData.name,
          apiDescription: formData.description,
          apiExpiry: formData.expiryDate
        }),
      });

      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        console.log('API key created successfully:', data);
        toast.success(data.message);
        fetchApiKeys(orgId ?? '')
      } else if (res.status === 401 || res.status === 403) {
         toast.error('Unauthorized access. Logging out...');
        logOut();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error(`Error creating API key: ${res.status}`, errorData);
        alert(`Failed to create API key: ${errorData.message || 'Unknown error'}`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();

    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) {
      await fetchApiKeys('');
      return;
    }
    // localStorage.setItem('orgId', trimmedTerm);
    await fetchApiKeys(trimmedTerm);
  };
  
  const handleInputChange = (value: string): void => {
    console.log('Input changed:', value);   
    setSearchTerm(value);

    if (!value.trim()) {
      setApiKeys([]);
      setFilteredApiKeys([]);
    }
  };

  return (
    <Blank title="API Keys">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">API Keys</h1>
          <p className="text-gray-600">Manage your API keys and access tokens</p>
        </div>

        {/* Search Bar and Create Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="Search API keys..."
            searchbtn={true}
            loading={loading}
            bodycls='w-120'
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Create API Key            
          </button>
        </div>

        {/* API Keys Table */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading API keys...</span>
            </div>
          </div>
        ) : filteredApiKeys && filteredApiKeys.length > 0 ? ( 
          <ApiKeyTable 
            apiKeys={filteredApiKeys}
            onDelete={handleDeleteApiKey}
            loading={loading}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No API keys found matching your search.' : 'No API keys found. Create a new API key to get started.'}
            </p>
          </div>
        )}

        {/* Modal for Creating API Key */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg"
            showCloseButton={true}
            isFullscreen={false}
          >
            <div className="h-[80vh] p-6 overflow-y-auto scrollbar-thin">
              <h2 className="text-2xl font-semibold mb-10">Create New API Key</h2>
              <ApiKeyForm
                onSubmit={handleCreateApiKey}
                onCancel={() => setIsModalOpen(false)}
                loading={isCreating}
              />
            </div>
          </Modal>
        )}
      </div>
    </Blank>
  );
};

export default ApiKey;