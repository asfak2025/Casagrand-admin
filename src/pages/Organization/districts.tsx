// import React, { useEffect, useState, useCallback } from 'react';
// import { ChevronLeft, ChevronRight, MapPin, Calendar, Hash } from 'lucide-react';
// import SearchBar from '../../components/ui/SearchBar';
// import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table';

// interface District {
//   districtId: string;
//   name: string;
//   createdAt: string;
// }

// const DistrictsTable = () => {
//   const [districts, setDistricts] = useState<District[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   const orgId = 'cfc16989-2d30-4273-8bd0-37cf913bdba6';
//   const token =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IlRNXzE3NTMwNzIyODczMTciLCJvcmdJZCI6ImNmYzE2OTg5LTJkMzAtNDI3My04YmQwLTM3Y2Y5MTNiZGJhNiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1Mzc4OTkzNCwiaWF0IjoxNzUzMTg1MTM0fQ.cFXBusVH9kffDyDr4THaSaK1xywQpRGrf4oaBfKlXOA';

// const debounce = (func: (...args: any[]) => void, delay: number) => {
//   let timer: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => func(...args), delay);
//   };
// };


//  const debouncedSearch = useCallback(
//   debounce((searchValue: string) => {
//     if (searchValue.trim()) {
//       handleSearch(undefined, searchValue);
//     } else {
//       fetchDistricts();
//     }
//   }, 500),
//   [] // Empty dependency array means this is created once
// );

//   const fetchDistricts = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(
//         `http://192.168.1.17:8000/api/district/all?orgId=${orgId}&page=${page}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();

//       setDistricts(data.districts || []);
//       setHasMore((data.districts || []).length === 10);
//     } catch (err) {
//       console.error('Error fetching districts:', err);
//       setError(`Failed to fetch districts: ${(err as Error).message}`);
//       setDistricts([]);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//     }
//   };
// const handleSearchChange = (value: string) => {
//   setSearchTerm(value);
//   debouncedSearch(value);
// };

//   const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent, searchVal?: string) => {
//   if (e) e.preventDefault();
//   const term = searchVal ?? searchTerm;
  
//   if (!term.trim()) {
//     setPage(1);
//     return fetchDistricts();
//   }

//   setLoading(true);
//   try {
//     const response = await fetch(`http://192.168.1.17:8000/api/district/search`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         orgId,
//         search_term: term, // Remove trim() here to allow partial matches
//       }),
//     });

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     setDistricts(data.results || []);
//     setHasMore(false);
//   } catch (err) {
//     setError(`Search failed: ${(err as Error).message}`);
//     setDistricts([]);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//   const handler = setTimeout(() => {
//     if (searchTerm.trim()) {
//       handleSearch(undefined, searchTerm);
//     } else {
//       fetchDistricts();
//     }
//   }, 500); // 500ms debounce

//   return () => clearTimeout(handler); // cleanup on retype
// }, [searchTerm]);


//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const TableView = () => (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="flex justify-end items-center mb-4 px-4 pt-4">
//         <SearchBar
//   placeholder="Search by district name or ID"
//   value={searchTerm}
//   onChange={handleSearchChange}  // Just pass the change handler
//   loading={loading}
//   onSearch={(e) => handleSearch(e)} // Manual search trigger if needed
//   searchbtn={true}
// />


//       </div>

//       <div className="overflow-x-auto">
//         <Table className="w-full">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District Name</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District ID</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <TableRow>
//                 <td colSpan={3} className="text-center py-10 text-gray-500">
//                   <div className="flex justify-center items-center space-x-2">
//                     <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
//                     <span>Loading districts...</span>
//                   </div>
//                 </td>
//               </TableRow>
//             ) : error ? (
//               <TableRow>
//                 <td colSpan={3} className="text-center py-10 text-red-500">
//                   {error}
//                 </td>
//               </TableRow>
//             ) : districts.length === 0 ? (
//               <TableRow>
//                 <td colSpan={3} className="text-center py-10 text-gray-500">
//                   No districts found.
//                 </td>
//               </TableRow>
//             ) : (
//               districts.map((district) => (
//                 <tr key={district.districtId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-900">{district.name}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500 font-mono">{district.districtId}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{formatDate(district.createdAt)}</td>
//                 </tr>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );

//   const CardsView = () => (
//     <>
//       <div className="flex justify-end items-center mb-4 px-4 pt-4">
//       <SearchBar
//       placeholder="Search by district name or ID"
//       value={searchTerm}
//      onChange={(value) => setSearchTerm(value)}

//       loading={loading}
//       onSearch={handleSearch}
//       searchbtn={true}
//       />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {loading ? (
//           <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
//         ) : error ? (
//           <div className="col-span-full text-center py-12 text-red-500">{error}</div>
//         ) : districts.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-gray-500">No districts found.</div>
//         ) : (
//           districts.map((district) => (
//             <div
//               key={district.districtId}
//               className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">{district.name}</h3>
//                 <MapPin className="w-5 h-5 text-gray-400" />
//               </div>
//               <div className="text-sm text-gray-600 space-y-2">
//                 <div className="flex items-center">
//                   <Hash className="w-4 h-4 mr-2" />
//                   <span className="font-mono">{district.districtId}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   <span>{formatDate(district.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div></>
   
//   );

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Districts</h1>
//           <p className="text-gray-600 mt-1">Manage and view all districts</p>
//         </div>
//         <div className="flex gap-4">
//           <div className="flex items-center bg-white rounded-lg p-1 border shadow-sm">
//             <button
//               onClick={() => setViewMode('table')}
//               className={`px-3 py-2 text-sm font-medium rounded-md ${
//                 viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Table
//             </button>
//             <button
//               onClick={() => setViewMode('cards')}
//               className={`px-3 py-2 text-sm font-medium rounded-md ${
//                 viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Cards
//             </button>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1 || loading}
//               className="flex items-center px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft className="w-4 h-4 mr-1" />
//               Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => p + 1)}
//               disabled={!hasMore || loading}
//               className="flex items-center px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
//             >
//               Next
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {viewMode === 'table' ? <TableView /> : <CardsView />}

//       <div className="flex justify-between items-center text-sm text-gray-500">
//         <span>Page {page}</span>
//         {!loading && districts.length > 0 && <span>{districts.length} district(s) shown</span>}
//       </div>
//     </div>
//   );
// };

// export default DistrictsTable;


import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Hash } from 'lucide-react';
import SearchBar from '../../components/ui/SearchBar';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table';

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

  const orgId = 'cfc16989-2d30-4273-8bd0-37cf913bdba6';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IlRNXzE3NTMwNzIyODczMTciLCJvcmdJZCI6ImNmYzE2OTg5LTJkMzAtNDI3My04YmQwLTM3Y2Y5MTNiZGJhNiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1Mzc4OTkzNCwiaWF0IjoxNzUzMTg1MTM0fQ.cFXBusVH9kffDyDr4THaSaK1xywQpRGrf4oaBfKlXOA';

  const fetchDistricts = async () => {
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
      console.error('Error fetching districts:', err);
      setError(`Failed to fetch districts: ${(err as Error).message}`);
      setDistricts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(async (searchValue: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://192.168.1.17:8000/api/district/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId,
          search_term: searchValue,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setDistricts(data.results || []);
      setHasMore(false);
    } catch (err) {
      console.error('Error searching districts:', err);
      setError(`Search failed: ${(err as Error).message}`);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search term changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchDistricts();
      } else {
        performSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchDistricts();
    }
  }, [page]);

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
        <SearchBar
          placeholder="Search by district name or ID"
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          loading={loading}
          onSearch={() => performSearch(searchTerm)}
          searchbtn={true}
        />
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District Name</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District ID</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <TableRow>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
                    <span>Loading districts...</span>
                  </div>
                </td>
              </TableRow>
            ) : error ? (
              <TableRow>
                <td colSpan={3} className="text-center py-10 text-red-500">
                  {error}
                </td>
              </TableRow>
            ) : districts.length === 0 ? (
              <TableRow>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  No districts found.
                </td>
              </TableRow>
            ) : (
              districts.map((district) => (
                <tr key={district.districtId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{district.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{district.districtId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(district.createdAt)}</td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const CardsView = () => (
    <>
      <div className="flex justify-end items-center mb-4 px-4 pt-4">
        <SearchBar
          placeholder="Search by district name or ID"
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          loading={loading}
          onSearch={() => performSearch(searchTerm)}
          searchbtn={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="col-span-full text-center py-12 text-red-500">{error}</div>
        ) : districts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No districts found.</div>
        ) : (
          districts.map((district) => (
            <div
              key={district.districtId}
              className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{district.name}</h3>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="font-mono">{district.districtId}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(district.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Districts</h1>
          <p className="text-gray-600 mt-1">Manage and view all districts</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center bg-white rounded-lg p-1 border shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cards
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="flex items-center px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || loading}
              className="flex items-center px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? <TableView /> : <CardsView />}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Page {page}</span>
        {!loading && districts.length > 0 && <span>{districts.length} district(s) shown</span>}
      </div>
    </div>
  );
};

export default DistrictsTable;