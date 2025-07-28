import React, { useState, useCallback } from 'react';

interface Member {
  memberId: string;
  memberName: string;
  memberPosition: string;
}

interface Constituency {
  constituencyId: string;
  constituencyName: string;
  createdAt: string;
  updatedAt: string;
  constituencyMembers: Member[];
}

const ConstiById = () => {
  const [constituency, setConstituency] = useState<Constituency | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [constituencyId, setConstituencyId] = useState('');


  const fetchConstituencyDetails = useCallback(async () => {
    if (!districtId || !constituencyId) {
      setError('Both District ID and Constituency ID are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://192.168.1.25:8000/api/district/getById-constituency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          orgId: 'cfc16989-2d30-4273-8bd0-37cf913bdba6',
          districtId,
          constituencyId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch constituency');
      }

      const data = await response.json();
      console.log("API Response:", data)
      setConstituency(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setConstituency(null);
    } finally {
      setLoading(false);
    }
  }, [districtId, constituencyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConstituencyDetails();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Get Constituency by ID</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">District ID</label>
            <input
              type="text"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter District ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Constituency ID</label>
            <input
              type="text"
              value={constituencyId}
              onChange={(e) => setConstituencyId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter Constituency ID (e.g., CN_1753338156993)"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Fetching...' : 'Get Details'}
        </button>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {constituency && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">{constituency.constituencyName}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Constituency ID</p>
                <p>{constituency.constituencyId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District ID</p>
                <p>{districtId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p>{new Date(constituency.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated At</p>
                <p>{new Date(constituency.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-medium mb-4">Members ({constituency.constituencyMembers?.length || 0})</h3>
            {constituency.constituencyMembers?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {constituency.constituencyMembers.map((member) => (
                      <tr key={member.memberId}>
                        <td className="px-6 py-4 whitespace-nowrap">{member.memberName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.memberPosition}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.memberId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No members found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstiById;