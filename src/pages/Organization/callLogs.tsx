  "use client";

  import React, { useEffect, useMemo, useState } from "react";
  import { ChevronLeft, ChevronRight, Phone, CheckCircle, AlertTriangle, Search } from "lucide-react";
  import { useAppContext } from "../../context/appContext";
  import { debounce } from "../../utils/debounce";


  interface DistrictResult {
    key: string;
    callLogsLength: number;
    positivePercentage: number;
    negativePercentage: number;
    districtName: string;
  }

  interface ApiResponse {
    groupBy: string;
    results: DistrictResult[];
    totalGroups: number;
    overallStats: {
      totalCalls: number;
      positivePercentage: number;
      negativePercentage: number;
    };
  }


  const Dashboard: React.FC = () => {
    const { URL } = useAppContext();
    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(9);

    const fetchAnalytics = async (page: number = 1) => {
      setLoading(true);
      setError(null);
      console.log("Fetching analytics data...");
      try {
        const payload = {
          groupBy: "districtId",
          page,
          limit,
        };

        const response = await await fetch(`${URL}call/call-analytics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        if (response?.ok) {
          const data: ApiResponse = await response.json();
          setApiData(data);
          console.log("Analytics Data:", data);
        } else {
          setError("Failed to fetch analytics data");
        }
      } catch (err) {
        setError("Error fetching analytics data");
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      console.log("Search term changed:", searchTerm);
      if (searchTerm.trim() === "") {
        fetchAnalytics(currentPage);
      } else {
        debouncedSearch(searchTerm);
      }
    }, [ searchTerm, currentPage ]);

    const searchAnalytics = async (term: string) => {
      setLoading(true);
      try {
        const payload = {
          searchTerm: term,
          mode: "district",
          page: 1,
          limit: 10,
        };

        const response = await fetch(`${URL}call/search-logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const newData = await response.json();
        if (response.status === 200) {
          setApiData((prev) => ({
            ...prev!,
            results: newData.results,
            totalGroups: newData.totalGroups,
          }));
        } else {
          setApiData(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const debouncedSearch = debounce(searchAnalytics, 1000);


    const filteredDistricts = useMemo(() => {
      if (!apiData?.results) return [];
      return apiData.results.filter(
        (d) =>
          d.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [apiData, searchTerm]);

    const totalPages = apiData ? Math.ceil(apiData.totalGroups / limit) : 0;

    const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

    if (!apiData) {
      return (
        <div className="max-w-7xl mx-auto py-20 text-center text-gray-500">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          No district analytics available
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Total Call Logs</span>
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {apiData.overallStats.totalCalls.toLocaleString()}
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Positive Feedback</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {apiData.overallStats.positivePercentage.toFixed(1)}%
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>Negative Feedback</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {apiData.overallStats.negativePercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Search + Results */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Districts ({filteredDistricts.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search districts..."
              className="pl-10 pr-4 py-2 border rounded-md w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredDistricts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            No matching districts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistricts.map((district) => (
              <div
                key={district.key}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer"
                onClick={() =>
                  console.log(`Navigate to district ${district.key}`) // Replace with actual navigation logic
                  // router.push(
                  //   `/operationTvk/TvkConstiCard?districtId=${district.key}&districtName=${district.districtName}`
                  // )
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {district.districtName}
                  </h3>
                  <span className="text-xs text-gray-500">{district.key}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {district.callLogsLength}
                    </div>
                    <div className="text-xs text-gray-500">Calls</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {district.positivePercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Positive</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-600">
                      {district.negativePercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Negative</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredDistricts.length > 0 && !searchTerm && totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="inline h-4 w-4" /> Prev
            </button>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <button
              className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="inline h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  export default Dashboard;
