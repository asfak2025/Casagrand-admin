import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Blank from '../../components/ui/Blank'
import { useLogOut } from '../../hooks/useLogOut';
import { toast } from 'react-toastify'
import { Trash2, Edit2 } from 'lucide-react'
import { useAppContext } from '../../context/appContext'
import { DeleteConfirmModal } from '../../components/Modal/deleteModal';
import { Modal } from '../../components/ui/modal';
import Select from '../../components/form/Select';
import SearchBar from '../../components/ui/SearchBar';
import Table from '../../components/tables/table';
import { TableCell, TableRow } from '../../components/ui/table';
import Pagination from "../../components/common/Pagination"

interface UserAgentprops {
  user_agent_id: string;
  agentId: string
  agentName: string
  description: string
  agentCategory: string
  agentVersion: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  agentTags: string[]
  agentStatus: string
}

function UserAgent() {
  const { URL } = useAppContext()
  const logOut = useLogOut();
  const navigate = useNavigate(); // Move this inside the component
  const [userAgents, setUserAgents] = useState<UserAgentprops[]>([])
  const [loading, setLoading] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserAgentprops | null>(null)
  const [allAgents, setAllAgents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UserAgentprops | null>(null)
  const [editAgentName, setEditAgentName] = useState('')
  const [editAgentDescription, setEditAgentDescription] = useState('')

  const [pageData, setPageData] = useState<string | undefined>("1"); 
  const [totalPages,setTotalPages] = useState(5)
  const [currentPage,setCurrentPage] = useState(1)
  const limit = 10

 
   useEffect(() => {
     const storedOrgId = localStorage.getItem('orgId');
     if(storedOrgId){
      console.log("====Works")
       fetchUserAgents(storedOrgId as string);
       setOrgId(storedOrgId)
     }
   }, [currentPage]);


  const fetchUserAgents = async (orgId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${URL}agents/getUserAgents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          pageNo: currentPage,
          pageSize: limit,
          orgId,
        }),
      })

      if (response.status === 200) {
            const data = await response.json()
            console.log("Agents Data === >", data)
            setUserAgents(data.agents || [])
            setTotalPages(Math.ceil(data.total / limit))
          } else if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access. Logging out...');
            logOut();
          } else {
            toast.error(`User Not Found`);
          }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    const str=orgId ?? ""
    const trimmedTerm = str.trim();
    if (!trimmedTerm) return;
    // localStorage.setItem('orgId', trimmedTerm);
    await fetchUserAgents(trimmedTerm);
  };

  const handleDelete = async (userAgentId: string) => {
    try {
      const response = await fetch(`${URL}agents/delete/${userAgentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      if (response.status === 200) {
        toast.success('User agent deleted successfully')
        if (orgId) {
          fetchUserAgents(orgId as string)
        }
      } else if (response.status === 401 || response.status === 403) {
        console.log('Unauthorized access. Logging out...');
        logOut();
      } else {
        toast.error(`User Not Found`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

 const fetchAllAgents = async () => {
  setLoading(true)
  const token = localStorage.getItem('token') || ''
  try {
    const response = await fetch(`${URL}agents/getAllAgents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (response.status === 200) {
      const data = await response.json()
      const options = data.map((agent: { agentName: any; agentId: any; }) => ({
        label: agent.agentName,
        value: agent.agentId
        }))
      console.log("option ===>", options)
      setAllAgents(options)
      setIsModalOpen(true)
    } else {
      toast.error(`Fetch failed (Status: ${response.status})`)
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong.')
  } finally {
    setLoading(false)
  }
}

const handleConfirm = async () => {
  if (!selectedAgentId || !agentName || !agentDescription) {
    toast.error('All fields are required');
    console.log("===> works");
    return;
  }

    try {
            const response = await fetch(`${URL}agents/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
              },
              body: JSON.stringify({
                agentId: selectedAgentId,
                agentName,
                agentDescription,
                orgId,
              }),
            })

            if (response.status === 200 || response.status === 201) {
              toast.success('Agent created successfully')
              setIsModalOpen(false)
              if (orgId) {
                fetchUserAgents(orgId as string)
              }
              setSelectedAgentId('')
              setAgentName('')
              setAgentDescription('')
            } else if (response.status === 401 || response.status === 403) {
              console.log('Unauthorized access. Logging out...');
              logOut();
            } else {
              toast.error(`Failed to create agent (Status: ${response.status})`)
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Create failed')
          }
}

const handleEditClick = (e: React.MouseEvent, user: UserAgentprops) => {
  e.stopPropagation();
  setEditTarget(user);
  setEditAgentName(user.agentName);
  setEditAgentDescription(user.description);
  setIsEditModalOpen(true);
};

// Edit API
const handleEditConfirm = async () => {
  if (!editTarget || !editAgentName.trim() || !editAgentDescription.trim()) {
    toast.error('All fields are required');
    return;
  }

  console.log("=-===>",editTarget)
  console.log("edit name ===>", editAgentName)
  console.log("edit des ===>", editAgentDescription)

  try {
    const response = await fetch(`${URL}agents/update/${editTarget.user_agent_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        agentId: editTarget.agentId,
        agentName: editAgentName,
        agentDescription: editAgentDescription,
        orgId
      }),
    });

    if (response.status === 200) {
      toast.success('Agent updated successfully');
      setIsEditModalOpen(false);
      setEditTarget(null);
      setEditAgentName('');
      setEditAgentDescription('');
      if (orgId) {
        fetchUserAgents(orgId as string);
      }
    } else if (response.status === 401 || response.status === 403) {
      console.log('Unauthorized access. Logging out...');
      logOut();
    } else {
      toast.error(`Failed to update agent (Status: ${response.status})`);
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Update failed');
  }
};


const handleRowClick = (user: UserAgentprops) => {
    localStorage.setItem("AgentID", user.agentId);
    localStorage.setItem("UserAgentId", user.user_agent_id);
    navigate(`/UserAgentbyId`, { state: { agentId: user.agentId, userAgentId: user.user_agent_id } });
};

const handleDeleteClick = (e: React.MouseEvent, user: UserAgentprops) => {
  e.stopPropagation(); 
  setDeleteTarget(user);
};

const renderRow = (row: Record<string, any>, rowIndex: number) => {
  const user = row as UserAgentprops;
  
  return (
    <TableRow
      key={rowIndex}
      onClick={() => handleRowClick(user)}
      className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100"
    >
      <TableCell className="px-6 py-4 text-start text-sm font-medium text-gray-900 hover:text-blue-600">
        {user.agentId}
      </TableCell>
      <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
        {user.agentName}
      </TableCell>
      <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
        {user.agentCategory}
      </TableCell>
      <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
        {user.agentVersion}
      </TableCell>
      <TableCell className="px-6 py-4 text-start text-sm text-gray-700">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.agentStatus.toLowerCase() === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {user.agentStatus}
          </span>
      </TableCell>
      <TableCell className="px-6 py-4 text-start text-sm text-gray-700">
         <div className="flex gap-5">
           <button
              onClick={(e) => handleEditClick(e, user)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
           <button
              onClick={(e) => handleDeleteClick(e, user)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
         </div>
      </TableCell>
    </TableRow>
  );
};

  return (
    <Blank title='User Agents'>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 flex gap-3 items-center">
             <SearchBar
                value={orgId ?? ""}
                onChange={setOrgId}
                onSearch={handleSearch}
                placeholder="Search users..."
                searchbtn={true}
                loading={loading}
                bodycls='w-120'
              />

          <button
            onClick={fetchAllAgents}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
          >
            Create Agent
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading user agents...</p>
        ) : (
          <>
            <Table
              header={["Agent", "Name", "Category", "Version", "Status","Actions"]}
              data={userAgents}
              renderRow={renderRow}
              className="enhanced-table"
            />
            <Pagination 
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              maxVisiblePages={5} 
              />
        </>
        )}

        <Modal isOpen={isModalOpen} className="max-w-xl max-h-[90vh]" onClose={() => setIsModalOpen(false)}>
          <div className="relative p-6  pr-12 space-y-6 overflow-y-auto max-h-[80vh]">
            <div>
                <h2 className="text-lg font-semibold mb-2">Create User Agent</h2>
            </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Agent ID</label>
            <Select options={allAgents}
                onChange={(value) => setSelectedAgentId(value)}
                placeholder="Select an agent"
            />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Name</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Description</label>
              <textarea
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Enter agent description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAgentId || !agentName.trim() || !agentDescription.trim()}
              className={`px-4 py-2 rounded text-white transition 
                ${!selectedAgentId || !agentName.trim() || !agentDescription.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              Confirm
            </button>

            </div>
          </div>
        </Modal>

         {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} className="max-w-xl max-h-[90vh]" onClose={() => setIsEditModalOpen(false)}>
          <div className="relative p-6 pr-12 space-y-6 overflow-y-auto max-h-[80vh]">
            <div>
              <h2 className="text-lg font-semibold mb-2">Edit User Agent</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Agent ID</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                value={editTarget?.agentId || ''}
                disabled
                placeholder="Agent ID (read-only)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Name</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                value={editAgentName}
                onChange={(e) => setEditAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Description</label>
              <textarea
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                value={editAgentDescription}
                onChange={(e) => setEditAgentDescription(e.target.value)}
                placeholder="Enter agent description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditTarget(null);
                  setEditAgentName('');
                  setEditAgentDescription('');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                disabled={!editAgentName || !editAgentDescription}
                className={`px-4 py-2 rounded text-white transition 
                  ${!editAgentName || !editAgentDescription
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                Update
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              handleDelete(deleteTarget.user_agent_id)
              setDeleteTarget(null)
            }
          }}
          title="Delete User Agent"
          message={`Are you sure you want to delete "${deleteTarget?.agentName}"? This action cannot be undone.`}
        />

      </div>
    </Blank>
  )
}

export default UserAgent