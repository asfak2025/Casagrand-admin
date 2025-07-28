


import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../../components/ui/badge/Badge';
import { TableCell } from '../../components/ui/table';

interface CallRecord {
  callId: any;
  id: string;
  agentName: string;
  agentId: string;
  callType: string;
  phoneNo: string;
  callStatus: string;
  callDate: string;
  callDuration: number;
}

const Callhistory: React.FC = () => {
  const { URL } = useAppContext();
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const [orgIdStore, setOrgIdStore] = useState<string>('');


  const limit = 10;
  const totalPages = Math.ceil(callHistory.length / limit);
  const paginatedData = callHistory.slice((currentPage - 1) * limit, currentPage * limit);

  const fetchCallHistory = async (orgIdFilter: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}callHistory/getAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: orgIdFilter,
          page: 1,         
        limit: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if(response.status === 200){
        setCallHistory(data.data || []);
      setCurrentPage(1);
       // toast.success("Tools fetched successfully");
       
  setOrgIdStore(orgIdFilter); // ✅ Save to state
  // localStorage.setItem("orgId", orgIdFilter); // ✅ Save to localStorage
      }
      //setCallHistory(data.data || []);
      //setCurrentPage(1); // Reset to first page
    } catch (error: any) {
      alert(error.message || 'Failed to fetch call history');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSearch = () => {
    if (orgId.trim()) {
      fetchCallHistory(orgId.trim());
    }
  };

  useEffect(() => {
  const storedOrgId = localStorage.getItem("orgId");
  if (storedOrgId) {
    setOrgIdStore(storedOrgId);
    setOrgId(storedOrgId); // sets input field
    fetchCallHistory(storedOrgId);
  }
}, []);


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Call History</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Org ID"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Agent Name</th>
              <th className="p-3">Agent ID</th>
              <th className="p-3">Call Type</th>
              <th className="p-3">Phone No</th>
              <th className="p-3">Call Status</th>
              <th className="p-3">Call Date</th>
              <th className="p-3">Duration (sec)</th>
            </tr>
           
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading call history...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((call) => (
                <tr
                  key={call.callId}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/CallhistoryById/${call.callId}`)}
                >
                 <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.agentName}</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.agentId}</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callType}</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.phoneNo}</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
  <Badge
    variant="light"
    color={
      call.callStatus.toLowerCase() === 'success'
        ? 'success'
        : call.callStatus.toLowerCase() === 'failed'
        ? 'error'
        : 'warning'
    }
  >
    {call.callStatus}
  </Badge>
</TableCell>

                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callDate}</TableCell>
                  <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callDuration}</TableCell>
                </tr>
              ))
            ) : searched ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No call history found.
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  Please enter an Org ID to view call history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-7 relative" style={{ left: '-65px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Callhistory;

// import React, { useState } from 'react';
// import { useAppContext } from '../../context/appContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from '../../components/ui/table'; // Adjust the path as needed

// import Badge from '../../components/ui/badge/Badge';

// interface CallRecord {
//   callId: any;
//   id: string;
//   agentName: string;
//   agentId: string;
//   callType: string;
//   phoneNo: string;
//   callStatus: string;
//   callDate: string;
//   callDuration: number;
// }

// const Callhistory: React.FC = () => {
//   const { URL } = useAppContext();
//   const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [orgId, setOrgId] = useState<string>('');
//   const [searched, setSearched] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const navigate = useNavigate();
//   const [totalCount, setTotalCount] = useState<number>(0);


//   const limit = 10; // Number of records per page
  
//   const paginatedData = callHistory;

//   const fetchCallHistory = async (orgIdFilter: string, page = 1) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${URL}callHistory/getAll`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
//         },
//         body: JSON.stringify({
//           orgId: orgIdFilter,
//           page: page,
//           limit: 10,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setCallHistory(data.data || []);
//       setTotalCount(data.totalCount || 0); // Set total count from backend
// setCurrentPage(page); // Update current page
      
//     } catch (error: any) {
//       alert(error.message || 'Failed to fetch call history');
//     } finally {
//       setLoading(false);
//       setSearched(true);
//     }
//   };

//   const handleSearch = () => {
//     if (orgId.trim()) {
//       fetchCallHistory(orgId.trim(), 1);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Call History</h2>

//       <div className="mb-4 flex gap-2">
//         <input
//           type="text"
//           placeholder="Enter Org ID"
//           value={orgId}
//           onChange={(e) => setOrgId(e.target.value)}
//           className="border p-2 rounded w-64"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Search
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <Table className="border text-sm text-left">
//           <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//             <TableRow>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Agent Name</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Agent ID</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Call Type</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Phone No</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Call Status</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Call Date</TableCell>
//               <TableCell isHeader  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Duration (sec)</TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody  className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="p-4 text-center">
//                   Loading call history...
//                 </TableCell>
//               </TableRow>
//             ) : callHistory.length > 0 ? (
//               callHistory.map((call) => (
//                 <TableRow
//                   key={call.callId}
//                   className="border-b hover:bg-gray-50 cursor-pointer"
//                   onClick={() => navigate(`/CallhistoryById/${call.callId}`)}
//                 >
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.agentName}</TableCell>
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.agentId}</TableCell>
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callType}</TableCell>
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.phoneNo}</TableCell>
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//   <Badge
//     variant="light"
//     color={
//       call.callStatus.toLowerCase() === 'success'
//         ? 'success'
//         : call.callStatus.toLowerCase() === 'failed'
//         ? 'error'
//         : 'warning'
//     }
//   >
//     {call.callStatus}
//   </Badge>
// </TableCell>

//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callDate}</TableCell>
//                   <TableCell  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{call.callDuration}</TableCell>
//                 </TableRow>
//               ))
//             ) : searched ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="p-4 text-center text-gray-500">
//                   No call history found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} className="p-4 text-center text-gray-400">
//                   Please enter an Org ID to view call history.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//      {totalCount > 10 && (
//   <div className="flex justify-center items-center gap-4 mt-7">
//     <button
//       disabled={currentPage === 1}
//       onClick={() => fetchCallHistory(orgId, currentPage - 1)}
//       className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//     >
//       Previous
//     </button>
//     <span className="font-semibold text-sm">
//       Page {currentPage} of {Math.ceil(totalCount / 10)}
//     </span>
//     <button
//       disabled={currentPage >= Math.ceil(totalCount / 10)}
//       onClick={() => fetchCallHistory(orgId, currentPage + 1)}
//       className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//     >
//       Next
//     </button>
//   </div>
// )}



//     </div>
//   );
// };

// export default Callhistory;
