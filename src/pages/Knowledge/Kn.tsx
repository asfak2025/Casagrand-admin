import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/appContext';
import Blank from '../../components/ui/Blank';
import Badge from "../../components/ui/badge/Badge";
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/table';
import { Modal } from '../../components/ui/modal';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import { Trash2 } from "lucide-react";
import { DeleteConfirmModal } from '../../components/Modal/deleteModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentUploadForm } from '../../components/KnBase/UploadForm';
import Button from '../../components/ui/button/Button';
import SearchBar from '../../components/ui/SearchBar';



interface Kn {
  knUrl: string;
  knName: string;
  knDescription: string;
  knType: string;
  knText: string;
  knId: string;
  knStatus: string;
}

const Kn: React.FC = () => {
  const { URL } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orgId, setOrgId] = useState('');
  const [kn, setKn] = useState<Kn[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [knToDelete, setKnToDelete] = useState<Kn | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [knType, setKnType] = useState<string | null>(null);
  const [knStatus, setKnStatus] = useState<string | null>(null);
  const [filteredKnList, setFilteredKnList] = useState<Kn[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);


  const [formData, setFormData] = useState({
    knUrl: "",
    knName: "",
    knDescription: "",
    knType: undefined as "URL" | "TEXT" | undefined,
    
    knText: ""
  });

  const limit = 10;

  type BadgeColor = "success" | "error" | "warning" | "light";

  

  const statusToColorMap: Record<string, BadgeColor> = {
    COMPLETED: "success",
    FAILED: "error",
    PROCESSING: "warning"
  };

  useEffect(() => {
    const orgSearch = localStorage.getItem("orgId");
    if (state?.orgId) {
      setOrgId(state.orgId);
      fetchAllKn(state.orgId);
    } else if (orgSearch) {
      setOrgId(orgSearch);
      fetchAllKn(orgSearch);
    }
  }, []);

  useEffect(() => {
    const orgSearch = localStorage.getItem("orgId");

    if (knType || knStatus) {
      fetchFilteredKn(orgSearch ?? "");
    }
  }, [knType, knStatus]);


  const buildQuery = (orgId?: string ,page = 1, limit = 10, knType?: string, knStatus?: string): string => {
    const params = new URLSearchParams();

    params.append("orgId", String(orgId));
    params.append("page", String(page));
    params.append("limit", String(limit));

    if (knType) params.append("knType", knType);
    if (knStatus) params.append("knStatus", knStatus);

    return params.toString();
  };


  const fetchFilteredKn = async (orgIdFilter: string) => {
  console.log("KN Type ====> ", knType)
  console.log("KN Status ====> ", knStatus)

  const query = buildQuery(
    orgIdFilter,
    1,
    10,
    knType ?? '',
    knStatus ?? ''
  );
  console.log("Query === >",query)
  try {
    setFilterLoading(true);
    const response = await fetch(`${URL}kn/filterKn?${query}`, {
      headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,      
        },
    });

    if (!response.ok) throw new Error("Failed to fetch filtered knowledge.");

    const data = await response.json();
    setKn(data.knBase || []);
    setFilteredKnList(data.knList || []);
  } catch (err) {
    console.error("Filter error:", err);
    setFilteredKnList([]);
  } finally {
    setFilterLoading(false);
  }
};


  const fetchAllKn = async (orgIdFilter: string, pageNumber: number = 1) => {
    setLoading(true);
    setCanCreate(false);
    try {
      const resp = await fetch(`${URL}kn/getAllKn?page=${pageNumber}&limit=${limit}&orgId=${orgIdFilter}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (resp.status !== 200) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }

      const data = await resp.json();
      setKn(data.knBase || []);
      setTotalPages(Math.ceil(data.total / limit));
      setPage(pageNumber);
      setCanCreate(true);
      // localStorage.setItem("orgId", orgIdFilter);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Unexpected error occurred');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const createKn = async (value: {
    knName: string;
    knDescription: string;
    knType: "URL" | "TEXT";
    knText: string;
    knUrl: string;
  }) => {
    setDialogOpen(false);
    try {
      const payload = {
        knName: value.knName,
        knDescription: value.knDescription,
        knType: value.knType,
        orgId: orgId,
        knUrl: value.knType === "URL" ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : "",
        knText: value.knType === "URL" ? "" : value.knText
      };

      const resp = await fetch(`${URL}kn/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resp.status !== 201) {
        toast.error("Failed to add data");
        return;
      }

      fetchAllKn(orgId);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!knToDelete) return;
    setIsDeleting(true);
    try {
      const resp = await fetch(`${URL}kn/delete/${knToDelete.knId}?orgId=${orgId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (resp.status !== 200) {
        throw new Error('Failed to delete knowledge item.');
      }

      toast.success("Knowledge item deleted successfully!");
      fetchAllKn(orgId, page);
    } catch {
      toast.error("Failed to delete knowledge item.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setKnToDelete(null);
    }
  };

  // const handleSearch = () => {
  //   if (orgId.trim()) 
  //     fetchAllKn(orgId.trim(), 1);
  // };
  const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    const str=orgId ?? ""
    const trimmedTerm = str.trim();
    if (!trimmedTerm) return;
    localStorage.setItem('orgId', trimmedTerm);
    await fetchAllKn(trimmedTerm);
    toast.success("Users Found")
  };

  const handleCreate = () => {
    setFormData({
      knUrl: "",
      knName: "",
      knDescription: "",
      knType: undefined,
      knText: ""
    });
    setDialogOpen(true);
  };

  const handleSubmit = (data: {
    knType: "URL" | "TEXT";
    knName: string;
    knStatus?: string;
    knDescription?: string;
    knText?: string;
    knId?: string;
    files?: File[];
    knUrl?: string;
  }) => {
    // Ensure all required fields for createKn are present
    createKn({
      knName: data.knName,
      knDescription: data.knDescription ?? "",
      knType: data.knType,
      knText: data.knText ?? "",
      knUrl: data.knUrl ?? "",
    });
  };


useEffect(() => {
    const orgSearch = localStorage.getItem("orgId");

  if ((knType || knStatus) && orgSearch) {
    fetchFilteredKn(orgSearch);
  }
}, [knType, knStatus]);


  useEffect(() => {
    const orgSearch = localStorage.getItem("orgId");
    if (state?.orgId) {
      setOrgId(state.orgId);
      fetchAllKn(state.orgId);
    } else if (orgSearch) {
      setOrgId(orgSearch);
      fetchAllKn(orgSearch);
    }
  }, []);

  const filteredKn = kn.filter(item => {
    return (
      (typeFilter === "" || item.knType === typeFilter) &&
      (statusFilter === "" || item.knStatus === statusFilter)
    );
  });


   const handleReset = () => {
    setKnType('')
    setKnStatus('')
    fetchAllKn(orgId)
    toast.success("Filters have been reset.")
  };

  return (
    <div>
      <Blank title="Knowledge">
           <div className="mb-8 flex gap-5 mt-5">
            <SearchBar
              value={orgId ?? ""}
              onChange={setOrgId}
              onSearch={handleSearch}
              placeholder="Search users..."
              searchbtn={true}
              loading={false}
              bodycls='w-110'
            />
            <div>
              <Button
              onClick={handleCreate}
              className={`!px-4 !py-3 text-sm rounded font-medium transition-colors ${
                canCreate 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create
            </Button>
            </div>
          </div>
          <div className="flex gap-10 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Type</label>
              <select
                value={knType ?? ""}
                onChange={(e) => setKnType(e.target.value || null)}
                className="px-4 !py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                <option value="">Select the option</option>
                <option value="TEXT">Text</option>
                <option value="URL">URL</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                value={knStatus ?? ""}
                onChange={(e) => setKnStatus(e.target.value || null)}
                className="px-4 !py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                <option value="">Select the option</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Reset</label>
              <div className="flex items-end">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="!px-4 !py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>


        <div className="overflow-x-auto pt-5">
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <Table className="text-sm text-center">
              <TableHeader className="bg-gray-100 border-b">
                <TableRow>
                  <TableCell isHeader className="p-3">#</TableCell>
                  <TableCell isHeader className="p-3">Kn ID</TableCell>
                  <TableCell isHeader className="p-3">Kn Name</TableCell>
                  <TableCell isHeader className="p-3">Kn Type</TableCell>
                  <TableCell isHeader className="p-3">Kn Status</TableCell>
                  <TableCell isHeader className="p-3">Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-4 text-center">Loading Knowledge Details...</TableCell>
                  </TableRow>
                ) : filteredKn.length > 0 ? (
                  filteredKn.map((p, index) => (
                    <TableRow key={p.knId}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`/knbyid`, { state: { knId: p.knId, orgId } })}
                    >
                      <TableCell className="p-3">{(page - 1) * 10 + index + 1}</TableCell>
                      <TableCell className="p-3">{p.knId}</TableCell>
                      <TableCell className="p-3">{p.knName}</TableCell>
                      <TableCell className="p-3">{p.knType}</TableCell>
                      <TableCell className="p-3">
                        <Badge variant="solid" color={statusToColorMap[p.knStatus] || "light"}>
                          {p.knStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setKnToDelete(p);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : searched ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-4 text-gray-500 text-center">
                      No Knowledge Found.
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="p-4 text-gray-400 text-center">
                      Please enter an Org ID to view Knowledge Details.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Blank>

      <Modal isOpen={dialogOpen} onClose={() => setDialogOpen(false)} className="max-w-[700px] m-4 p-5">
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Create Knowledge</h2>
        </div>
        <DocumentUploadForm
          formData={formData}
          onSubmit={handleSubmit}
          handleClose={() => setDialogOpen(false)}
        />
      </Modal>

      {filteredKn.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => fetchAllKn(orgId, newPage)}
          maxVisiblePages={7}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setKnToDelete(null);
        }}
        onConfirm={handleDelete}
        itemName={knToDelete?.knName}
        isLoading={isDeleting}
      />

    </div>
  );
};

export default Kn;