import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '../../components/ui/SearchBar';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useParams, useLocation } from 'react-router-dom';

interface Constituency {
  constituencyId: string;
  constituencyName:string;
  name: string;
  createdAt: string;
}

const Constituencies = () => {
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [districtName, setDistrictName] = useState<string>('');
  
  const { districtId } = useParams();
  console.log(useParams(),"hdghdsgfh");
  const location = useLocation();
  const limit = 10;

  const orgId = 'cfc16989-2d30-4273-8bd0-37cf913bdba6';
  const token = localStorage.getItem('token') || '';

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const fetchConstituencies = useCallback(async () => {
  //   if (isSearchMode || !districtId) return;

  //   setLoading(true);
  //   setError('');
  //   try {
  //     const response = await fetch(
  //       `http://192.168.1.25:8000/api/district/getAll-constituency`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           orgId,
  //           districtId,
  //           page,
  //           limit
  //         }),
  //       }
  //     );

  //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //     const data = await response.json();

  //     setConstituencies(data.constituencies || []);
  //     setHasMore((data.constituencies || []).length === limit);
      
  //     if (location.state?.districtName) {
  //       setDistrictName(location.state.districtName);
  //     }
  //   } catch (err) {
  //     setError(`Failed to fetch constituencies: ${(err as Error).message}`);
  //     setConstituencies([]);
  //     setHasMore(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [orgId, token, page, isSearchMode, districtId, limit, location.state]);


  const fetchConstituencies = useCallback(async () => {
  if (!districtId) {
    console.error("District ID is missing");
    return;
  }

  console.log("Fetching constituencies for district:", districtId); // Debug log

  setLoading(true);
  setError('');
  try {
    const response = await fetch(
      `http://192.168.1.25:8000/api/district/getAll-constituency`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orgId,
          districtId,
          page,
          limit
        }),
      }
    );

    console.log("API Response status:", response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData); // Debug log
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Data:", data); // Debug log

    setConstituencies(data.constituencies || []);
    setHasMore(data.constituencies?.length === limit);
    
    if (location.state?.districtName) {
      setDistrictName(location.state.districtName);
    }
  } catch (err) {
    console.error("Fetch error:", err); // Debug log
    setError(`Failed to fetch constituencies: ${(err as Error).message}`);
    setConstituencies([]);
    setHasMore(false);
  } finally {
    setLoading(false);
  }
}, [orgId, token, page, districtId, limit, location.state]);
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isSearchMode) fetchConstituencies();
  }, [page, fetchConstituencies, isSearchMode]);

  const performSearch = useCallback(async (searchValue: string) => {
    console.log(districtId);
    if (!searchValue.trim()) {
      setIsSearchMode(false);
      setPage(1);
      fetchConstituencies();
      return;
    }

    console.log(searchValue,"searchValue")

    // if (!districtId) return;

    setIsSearchMode(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/search-constituency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
        orgId,
        searchText: searchValue,
        page,
        limit: 10
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setConstituencies(data.constituencies || []);
      setHasMore(false);
    } catch (err) {
      setError(`Search failed: ${(err as Error).message}`);
      setConstituencies([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, token, fetchConstituencies, districtId]);

  const handleInputChange = (value: string): void => {
    setSearchTerm(value);
  
  };

  const handleSearch = (e?: React.MouseEvent | React.KeyboardEvent): void => {
    if (e) e.preventDefault();
    console.log(searchTerm);
    performSearch(searchTerm);
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
        <SearchBar
          placeholder="Search by constituency name or ID"
          value={searchTerm}
          onChange={handleInputChange}
          loading={loading}
          onSearch={handleSearch}
          searchbtn={true}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Constituency Name</TableHead>
              <TableHead>Constituency ID</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><td colSpan={3} className="text-center py-6">Loading...</td></TableRow>
            ) : error ? (
              <TableRow><td colSpan={3} className="text-center py-6 text-red-500">{error}</td></TableRow>
            ) : constituencies.length === 0 ? (
              <TableRow><td colSpan={3} className="text-center py-6">No constituencies found.</td></TableRow>
            ) : (
              constituencies.map((constituency) => (
                <tr
                  key={constituency.constituencyId}
                  className="hover:bg-gray-100"
                >
                  <td>{constituency.constituencyName}</td>
                  <td className="font-mono">{constituency.constituencyId}</td>
                  <td>{formatDate(constituency.createdAt)}</td>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const CardsView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {constituencies.map((constituency) => (
        <div
          key={constituency.constituencyId}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold">{constituency.name}</h3>
          <p className="text-sm text-gray-500">ID: <span className="font-mono">{constituency.constituencyId}</span></p>
          <p className="text-sm text-gray-500">Created: {formatDate(constituency.createdAt)}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {districtName ? `${districtName} Constituencies` : 'Constituencies'}
          </h1>
          <p className="text-gray-600">View all constituencies</p>
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

      {viewMode === 'table' ? TableView() : CardsView() }

      <div className="text-sm text-gray-500 flex justify-between">
        <span>{isSearchMode ? 'Search Results' : `Page ${page}`}</span>
        <span>{constituencies.length} constituency(s) shown</span>
      </div>
    </div>
  );
};

export default Constituencies;

