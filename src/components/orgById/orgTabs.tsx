// components.tsx
import React, { useState } from 'react';
import { Edit, Eye, EyeOff, Users, Building, ChevronUp, ChevronDown } from 'lucide-react';
import {
    TabButtonProps,
    TabContentProps,
    OrganizationData,
    OrgMember,
    AgentDetails,
    BillingRecord
} from './types';
import { agentData, billingData } from './data';
import Switch from '../form/switch/Switch';
import ConfirmModal from '../Modal/confirmModal';
import { useNavigate } from 'react-router-dom';

export const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${isActive
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
    >
        <div className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
        </div>
    </button>
);

export const OrganizationHeader: React.FC<{ data: OrganizationData }> = ({ data }) => {
    const [logoError, setLogoError] = useState(false);

    return (
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                        <Building className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data.orgName}</h1>
                    <p className="text-gray-600">Organization ID: {data.orgId}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${data.orgStatus === 'ACTIVE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {data.orgStatus}
                        </span>
                        {/* <span className="text-sm text-gray-500">
                            {data.orgMembers.length} members
                        </span> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export const OverviewTab: React.FC<TabContentProps> = ({ data, onEdit, formatDate }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Organization Overview</h2>
            <button
                onClick={() => onEdit('overview')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                <Edit className="h-4 w-4" />
                Edit
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization ID</label>
                <p className="text-gray-900">{data?.orgId}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <p className="text-gray-900">{data?.orgName}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${data?.orgStatus.toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800 '}`}>
                    {data?.orgStatus}
                </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Members</label>
                <p className="text-gray-900">{data.orgMembers?.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Members</label>
                <p className="text-gray-900">{data?.orgMembers?.filter(m => m.member_status?.toLowerCase() === 'active').length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                <img src={data?.orgLogo} alt="Logo" className="h-12 w-90 rounded object-cover" />
            </div>
        </div>
    </div>
);

export const MembersTab: React.FC<TabContentProps> = ({ data, onEdit, formatDate, showPassword, setShowPassword }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Organization Members</h2>
            <button
                onClick={() => onEdit('members')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                <Users className="h-4 w-4" />
                Manage Members
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* {data.orgMembers.map((member: OrgMember) => ( */}
                    {data.orgMembers.map((member: any) => (
                        <tr key={member.member_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {member.member_name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{member.member_name}</div>
                                        <div className="text-sm text-gray-500">{member.member_id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.member_email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {member.member_role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.member_status.toLowerCase() === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'}`}>
                                    {member.member_status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center gap-2">
                                    <span>{showPassword[member.member_id] ? member.member_password : '••••••'}</span>
                                    <button
                                        onClick={() => setShowPassword(prev => ({
                                            ...prev,
                                            [member.member_id]: !prev[member.member_id]
                                        }))}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword[member.member_id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(member.member_join_date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const AccessTab: React.FC<TabContentProps> = ({ data, onEdit }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Access Permissions</h2>
            <button
                onClick={() => onEdit('access')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                <Edit className="h-4 w-4" />
                Edit Permissions
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Access</h3>
                <div className="space-y-2">
                    {data?.orgAdminAccess?.map((access: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{access}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Support Access</h3>
                <div className="space-y-2">
                    {data?.orgSupportAccess?.map((access: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{access}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Collection Access</h3>
                <div className="space-y-2">
                    {data?.orgCollectionAccess?.map((access: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{access}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const AgentsTab: React.FC<TabContentProps> = ({ data, onEdit }) => {
    const navigate = useNavigate();
    const initialAgentList = agentData[data.orgId] || [];

    const [agentListState, setAgentListState] = useState(initialAgentList);

    const [switchStates, setSwitchStates] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        initialAgentList.forEach(agent => {
            initial[agent.agentId] = agent.agentStatus === 'ACTIVE';
        });
        return initial;
    });

    const [modalState, setModalState] = useState<{
        open: boolean;
        agentId: string | null;
        pendingStatus: 'ACTIVE' | 'INACTIVE';
    }>({
        open: false,
        agentId: null,
        pendingStatus: 'INACTIVE',
    });

    const handleToggleClick = (checked: boolean, agentId: string) => {
        setModalState({
            open: true,
            agentId,
            pendingStatus: checked ? 'ACTIVE' : 'INACTIVE',
        });
    };

    const confirmToggle = () => {
        if (modalState.agentId) {
            const updatedList = agentListState.map(agent =>
                agent.agentId === modalState.agentId
                    ? { ...agent, agentStatus: modalState.pendingStatus }
                    : agent
            );
            setAgentListState(updatedList);

            setSwitchStates(prev => ({
                ...prev,
                [modalState.agentId!]: modalState.pendingStatus === 'ACTIVE',
            }));
        }
        setModalState({ open: false, agentId: null, pendingStatus: 'INACTIVE' });
    };

    const cancelToggle = () => {
        setModalState({ open: false, agentId: null, pendingStatus: 'INACTIVE' });
    };

    if (!agentListState.length) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500">
                    <p>No agent data available for this organization.</p>
                    <p className="text-sm mt-2">Agent configuration has not been set up yet.</p>
                </div>
            </div>
        );
    }

    const handleRowClick = (agentId: string) => {
        navigate(`/agentbyid?orgId=${data.orgId}&agentId=${agentId}`);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Agent Overview</h2>
                <button
                    onClick={() => onEdit('agents')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Edit className="h-4 w-4" />
                    Manage Agents
                </button>
            </div>

            {/* <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numbers</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {agentListState.map((agent) => (
                            <tr 
                                key={agent.agentId}
                                onClick={() => handleRowClick(agent.agentId)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.agentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.agentId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.phoneNumbers.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        agent.agentStatus === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {agent.agentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        label=""
                                        color="blue"
                                        disabled={false}
                                        checked={switchStates[agent.agentId]}
                                        onChange={(checked) => handleToggleClick(checked, agent.agentId)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={modalState.open}
                message={`Are you sure you want to ${modalState.pendingStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this agent?`}
                onCancel={cancelToggle}
                onConfirm={confirmToggle}
            /> */}
        </div>
    );
};

// export const BillingTab: React.FC<TabContentProps> = ({ data, onEdit, formatDate, getStatusColor }) => {
//   // Get billing data for the current organization
//   const billingInfo = billingData[data.orgId];

//   if (!billingInfo) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-gray-500">
//           <p>No billing data available for this organization.</p>
//           <p className="text-sm mt-2">Billing information has not been set up yet.</p>
//         </div>
//       </div>
//     );
//   }

//   const getPaymentStatusColor = (status: string): string => {
//     switch (status.toLowerCase()) {
//       case 'paid':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'overdue':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Billing Information</h2>
//         <button
//           onClick={() => onEdit('billing')}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Edit className="h-4 w-4" />
//           Manage Billing
//         </button>
//       </div>

//       <div className="space-y-4">
//         {billingInfo.invoices.map((invoice: any) => (
//           <div
//             key={invoice.invoiceId}
//             className="border rounded-lg p-6 shadow-sm bg-white"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h3 className="font-semibold text-lg">Invoice #{invoice.invoiceId}</h3>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(invoice.status)}`}>
//                     {invoice.status}
//                   </span>
//                 </div>
//                 <p className="text-gray-600 text-sm">{invoice.billingPeriod}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</p>
//                 <p className="text-sm text-gray-500">Amount Due</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="bg-gray-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Generated</p>
//                 <p className="font-medium">{formatDate(invoice.generatedAt)}</p>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Due Date</p>
//                 <p className="font-medium">{formatDate(invoice.dueDate)}</p>
//               </div>
//               <div className="bg-gray-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Payment Status</p>
//                 <div className="flex items-center gap-2">
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(invoice.status)}`}>
//                     {invoice.status}
//                   </span>
//                   {invoice.paidAt && (
//                     <span className="text-xs text-gray-500">
//                       Paid on {formatDate(invoice.paidAt)}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {invoice.paymentMethod && (
//               <div className="mb-4">
//                 <span className="text-sm text-gray-600">Payment Method: </span>
//                 <span className="font-medium">{invoice.paymentMethod}</span>
//               </div>
//             )}

//             {invoice.callSummary && (
//               <div className="border-t pt-4">
//                 <h4 className="font-medium text-gray-900 mb-3">Call Summary</h4>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="text-center p-3 bg-blue-50 rounded-lg">
//                     <p className="text-2xl font-bold text-blue-600">{invoice.callSummary.totalCalls}</p>
//                     <p className="text-sm text-gray-600">Total Calls</p>
//                   </div>
//                   <div className="text-center p-3 bg-green-50 rounded-lg">
//                     <p className="text-2xl font-bold text-green-600">{invoice.callSummary.totalMinutes}</p>
//                     <p className="text-sm text-gray-600">Total Minutes</p>
//                   </div>
//                   <div className="text-center p-3 bg-purple-50 rounded-lg">
//                     <p className="text-2xl font-bold text-purple-600">₹{invoice.callSummary.totalCost.toFixed(2)}</p>
//                     <p className="text-sm text-gray-600">Total Call Cost</p>
//                   </div>
//                   <div className="text-center p-3 bg-orange-50 rounded-lg">
//                     <p className="text-2xl font-bold text-orange-600">₹{invoice.callSummary.avgCostPerCall.toFixed(2)}</p>
//                     <p className="text-sm text-gray-600">Avg. Cost/Call</p>
//                   </div>
//                 </div>
//                 <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                   <p>
//                     <strong>Billing Period:</strong> {invoice.callSummary.startDate} to {invoice.callSummary.endDate}
//                   </p>
//                   <p>
//                     <strong>Average Cost per Minute:</strong> ₹{invoice.callSummary.avgCostPerMinute.toFixed(3)}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
export const BillingTab: React.FC<TabContentProps> = ({ data, onEdit, formatDate }) => {
  // Get billing data for the current organization
  const billingInfo = billingData[data.orgId];
  
  // State to track which invoices are expanded
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});

  const toggleInvoiceExpansion = (invoiceId: string) => {
    setExpandedInvoices(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };

  if (!billingInfo) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <p>No billing data available for this organization.</p>
          <p className="text-sm mt-2">Billing information has not been set up yet.</p>
        </div>
      </div>
    );
  }

  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Billing Information</h2>
        <button
          onClick={() => onEdit('billing')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          Manage Billing
        </button>
      </div>

      <div className="space-y-4">
        {billingInfo.invoices.map((invoice) => (
          <div
            key={invoice.invoiceId}
            className="border rounded-lg shadow-sm bg-white"
          >
            {/* Collapsed Header */}
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleInvoiceExpansion(invoice.invoiceId)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">Invoice #{invoice.invoiceId}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getPaymentStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
                <p className="text-gray-600">{invoice.billingPeriod}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{invoice.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Amount Due</p>
                </div>
                <div className="text-gray-400">
                  {expandedInvoices[invoice.invoiceId] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedInvoices[invoice.invoiceId] && (
              <div className="px-6 pb-6 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-600">Generated</p>
                    <p className="font-medium">{formatDate(invoice.generatedAt)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      {invoice.paidAt && (
                        <span className="text-xs text-gray-500">
                          Paid on {formatDate(invoice.paidAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {invoice.paymentMethod && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Payment Method: </span>
                    <span className="font-medium">{invoice.paymentMethod}</span>
                  </div>
                )}

                {invoice.callSummary && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Call Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg border">
                        <p className="text-2xl font-bold ">{invoice.callSummary.totalCalls}</p>
                        <p className="text-sm text-gray-600">Total Calls</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border">
                        <p className="text-2xl font-bold ">{invoice.callSummary.totalMinutes}</p>
                        <p className="text-sm text-gray-600">Total Minutes</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border">
                        <p className="text-2xl font-bold ">₹{invoice.callSummary.totalCost.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total Call Cost</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border">
                        <p className="text-2xl font-bold ">₹{invoice.callSummary.avgCostPerCall.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Avg. Cost/Call</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 bg-white p-3 rounded-lg border">
                      <p>
                        <strong>Billing Period:</strong> {invoice.callSummary.startDate} to {invoice.callSummary.endDate}
                      </p>
                      <p>
                        <strong>Average Cost per Minute:</strong> ₹{invoice.callSummary.avgCostPerMinute.toFixed(3)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};