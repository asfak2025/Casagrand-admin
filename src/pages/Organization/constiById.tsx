import React, { useState, useCallback } from 'react';
import Blank from '../../components/ui/Blank';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '../../components/ui/table';

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Blank title="Constituency Details">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Get Constituency by ID</h1>
        <p className="text-gray-600 mt-2">View detailed information about a specific constituency</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District ID</label>
            <input
              type="text"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter District ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Constituency ID</label>
            <input
              type="text"
              value={constituencyId}
              onChange={(e) => setConstituencyId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Constituency ID"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Fetching...' : 'Get Details'}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {constituency && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{constituency.constituencyName}</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Constituency ID</p>
                  <p className="font-mono text-sm">{constituency.constituencyId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District ID</p>
                  <p className="font-mono text-sm">{districtId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p>{formatDate(constituency.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p>{formatDate(constituency.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Members ({constituency.constituencyMembers?.length || 0})
              </h3>
              {constituency.constituencyMembers?.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Member ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {constituency.constituencyMembers.map((member) => (
                      <TableRow key={member.memberId} className="hover:bg-gray-50">
                        <TableCell>{member.memberName}</TableCell>
                        <TableCell>{member.memberPosition}</TableCell>
                        <TableCell className="font-mono text-sm">{member.memberId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 py-4">No members found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Blank>
  );
};

export default ConstiById;