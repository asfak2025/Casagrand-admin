import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Blank from '../../components/ui/Blank';
import Switch from '../../components/form/switch/Switch';
import ConfirmModal from '../../components/Modal/confirmModal';
import { agentData } from '../../components/orgById/data';

// Lucide Icons
import {
  Phone,
  CheckCircle,
  XCircle,
  PhoneCall,
  Voicemail,
  PhoneOff,
  Gauge,
  Timer
} from 'lucide-react';

const AgentById: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orgId = searchParams.get('orgId') || '';
  const agentId = searchParams.get('agentId') || '';

  const agents = agentData[orgId] || [];
  const agent = agents.find(a => a.agentId === agentId);

  const [numberStates, setNumberStates] = useState<Record<string, boolean>>({});
  const [modalState, setModalState] = useState<{
    open: boolean;
    phoneId: string | null;
    pendingStatus: 'ACTIVE' | 'INACTIVE';
  }>({ open: false, phoneId: null, pendingStatus: 'INACTIVE' });

  useEffect(() => {
    if (agent) {
      const initial: Record<string, boolean> = {};
      agent.phoneNumbers.forEach(p => {
        initial[p.agentId] = p.status === 'ACTIVE';
      });
      setNumberStates(initial);
    }
  }, [agent]);

  const handlePhoneToggle = (checked: boolean, phoneId: string) => {
    setModalState({
      open: true,
      phoneId,
      pendingStatus: checked ? 'ACTIVE' : 'INACTIVE',
    });
  };

  const confirmPhoneToggle = () => {
    const { phoneId, pendingStatus } = modalState;
    if (phoneId) {
      setNumberStates(prev => ({
        ...prev,
        [phoneId]: pendingStatus === 'ACTIVE',
      }));
      const phone = agent?.phoneNumbers.find(p => p.agentId === phoneId);
      if (phone) phone.status = pendingStatus;
    }
    setModalState({ open: false, phoneId: null, pendingStatus: 'INACTIVE' });
  };

  const cancelPhoneToggle = () => {
    setModalState({ open: false, phoneId: null, pendingStatus: 'INACTIVE' });
  };

  if (!agent) {
    return (
      <Blank title="Agent Details">
        <div className="text-center text-gray-500 py-12">
          No agent found for the given ID.
        </div>
      </Blank>
    );
  }

  // Summary Stats
  const totalNumbers = agent.phoneNumbers.length;
  const activeNumbers = agent.phoneNumbers.filter(p => p.status === 'ACTIVE').length;
  const inactiveNumbers = totalNumbers - activeNumbers;
  const totalCalls = agent.phoneNumbers.reduce((sum, p) => sum + p.totalCalls, 0);
  const totalAnswered = agent.phoneNumbers.reduce((sum, p) => sum + p.answered, 0);
  const totalMissed = agent.phoneNumbers.reduce((sum, p) => sum + p.missed, 0);
  const successRate = totalCalls > 0 ? Math.round((totalAnswered / totalCalls) * 100) : 0;
  const averageDuration = totalNumbers > 0
    ? Math.round(agent.phoneNumbers.reduce((sum, p) => sum + p.averageDur, 0) / totalNumbers)
    : 0;

  const cardData = [
    { label: 'Total Numbers', value: totalNumbers, icon: Phone},
    { label: 'Active Numbers', value: activeNumbers, icon: CheckCircle },
    { label: 'Inactive Numbers', value: inactiveNumbers, icon: XCircle },
    { label: 'Total Calls', value: totalCalls, icon: PhoneCall },
    { label: 'Answered', value: totalAnswered, icon: Voicemail },
    { label: 'Missed', value: totalMissed, icon: PhoneOff },
    { label: 'Success Rate', value: `${successRate}%`, icon: Gauge },
    { label: 'Avg Duration', value: `${averageDuration} sec`, icon: Timer },
  ];

  return (
    <Blank title={`Agent: ${agent.agentName}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cardData.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`bg-gray-50 shadow p-4 rounded-lg flex items-center gap-4`}>
            <div className={`p-2 rounded-full bg-white shadow`}>
              <Icon className={`h-6 w-6 text-black`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-lg font-semibold text-black`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <p className="text-gray-900">{agent.agentName}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Description</label>
          <p className="text-gray-900">{agent.agentDescription}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
          <p className="text-gray-900">{agent.memberId}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
          <p className="text-gray-900">{agent.agentId}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Agent Status</label>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${agent.agentStatus === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            {agent.agentStatus}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
          <p className="text-gray-900">{new Date(agent.createdAt).toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
          <p className="text-gray-900">{new Date(agent.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Phone Numbers Table */}
      <div>
        <h3 className="text-lg font-medium mb-4">Phone Numbers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Calls</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agent.phoneNumbers.map(phone => (
                <tr key={phone.agentId}>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.agentNo}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${numberStates[phone.agentId]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {numberStates[phone.agentId] ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.totalCalls}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.answered}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.missed}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {phone.totalCalls > 0 ? Math.round((phone.answered / phone.totalCalls) * 100) : 0}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{phone.averageDur}</td>
                  <td className="px-6 py-4">
                    <Switch
                      label=""
                      color="blue"
                      disabled={false}
                      checked={numberStates[phone.agentId]}
                      onChange={(checked) => handlePhoneToggle(checked, phone.agentId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalState.open}
        message={`Are you sure you want to ${modalState.pendingStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this number?`}
        onCancel={cancelPhoneToggle}
        onConfirm={confirmPhoneToggle}
      />
    </Blank>
  );
};

export default AgentById;
