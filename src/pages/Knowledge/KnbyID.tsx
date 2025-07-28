import { useState, useEffect } from 'react';
import { Search, Database, Globe, Clock, FileText, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import { getUpdatedFields } from '../../utils/updateFields';
import { Modal } from "../../components/ui/modal";
import { toast } from 'react-toastify';
import { DocumentUploadForm } from '../../components/KnBase/UploadForm';
type knDetails = {
  knId: string;
  orgId: string;
  knUrl: string;
  knText: string;
  knName: string;
  knDescription: string;
  knStatus: string;
  knType: string;
};

const KnbyID = () => {

  const { URL } = useAppContext();
  const location = useLocation();
  const state = location.state as { orgId?: string; knId?: string } | null;
  const [orgId, setOrgId] = useState('');
  const [knId, setKnId] = useState('');
  const [knDetails, setKnDetails] = useState<knDetails | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editableKn, setEditableKn] = useState({
    knUrl: "",
    knName: "",
    knDescription: "",
    knStatus: "",
    knType: "",
    knText: "",
  });

useEffect(() => {
  if (knDetails) {
    setEditableKn({
      knUrl: knDetails.knUrl || "",
      knName: knDetails.knName || "",
      knDescription: knDetails.knDescription || "",
      knStatus: knDetails.knStatus || "",
      knType: knDetails.knType || "",
      knText: knDetails.knText || "",
    });
  }
}, [knDetails]);

useEffect(() => {
  const paramOrgId = state?.orgId ?? localStorage.getItem("orgId") ?? "";
  const paramKnId = state?.knId ?? localStorage.getItem("knId") ?? "";

  setOrgId(paramOrgId);
  setKnId(paramKnId);

  if (paramOrgId && paramKnId) {
    fetchKnDetails(paramOrgId, paramKnId);
  }
}, [state]);

const handleUpdate = async (updateValues) => {
  try {
    const value= getUpdatedFields(knDetails,updateValues);

    const response = await fetch(`${URL}kn/update/${knId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...value, orgId }),
    });

    if (!response.ok) throw new Error("Update failed");

    await fetchKnDetails(orgId, knId);

    setShowUpdateModal(false);
    toast.success("Knowledge item updated successfully!");
  } catch (error) {
        toast.error("Failed to update knowledge item.");
      }
    }

  const fetchKnDetails = async (orgId: string, knId: string) => {
    if (!orgId || !knId) {
      setError('Please enter both Org ID and Knowledge ID');
      return;
    }

    setLoading(true);
    setError('');
    
        try {
      const resp = await fetch(`${URL}kn/${knId}?orgId=${orgId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!resp.ok) throw new Error("Failed to fetch knowledge details");

      const data = await resp.json();
      // localStorage.setItem("orgId",orgId)
      localStorage.setItem("knId",knId)
      setKnDetails(data);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setKnDetails(null);
        setError(err.message);
      } else {
        setKnDetails(null);
        setError("An unknown error occurred");
      }
    }finally {
    setLoading(false); 
  }
  };


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'failed': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl text-center font-semibold text-gray-900">Knowledge By ID</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4 mr-2 text-gray-500" />
                  Organization ID
                </label>
                <input
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter organization ID"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Knowledge ID
                </label>
                <input
                  type="text"
                  value={knId}
                  onChange={(e) => setKnId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter knowledge ID"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => fetchKnDetails(orgId, knId)}
                disabled={loading}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>

        {knDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Knowledge Details</h3>
                  <p className="text-sm text-gray-500">Record found and retrieved successfully</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Knowledge ID
                    </label>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                      {knDetails.knId}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Organization ID
                    </label>
                    <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                      {orgId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Name
                    </label>
                    <div className="text-sm text-gray-900">
                      {knDetails.knName}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </label>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{knDetails.knType}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      URL
                    </label>
                    <a 
                      href={knDetails.knUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {knDetails.knUrl}
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Status
                    </label>
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(knDetails.knStatus)}`}>
                      {getStatusIcon(knDetails.knStatus)}
                      <span>{knDetails.knStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Description
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                    {knDetails.knDescription}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Text Content
                  </label>
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded border">
                    {knDetails.knText}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 p-5 flex justify-center">
              <button
                onClick={() => setShowUpdateModal(true)}
                className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Update
              </button>
            </div>


          </div>

          
        )}

        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          className="max-w-2xl w-full p-4 space-y-3"
        >
          <div className='p-4'>
          <h2 className="text-xl font-semibold text-gray-900">Edit Knowledge</h2>
        </div>
         <DocumentUploadForm
                  formData={editableKn}
                  onSubmit={handleUpdate}
                  handleClose={() => setShowUpdateModal(false)}
                  updateFlag={true}
                />

        </Modal>
      </div>
    </div>
  );
}

export default KnbyID;