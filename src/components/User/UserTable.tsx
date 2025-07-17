import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/tables/table';
import { TableCell, TableRow } from '../../components/ui/table';
import StatusBadge from './Status';
import Switch from '../form/switch/Switch';
import ConfirmModal from '../Modal/confirmModal';

export type Organization = {
  orgId: string;
  orgName: string;
  orgStatus: string;
};

export type User = {
  orgId: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

interface UserTableProps {
  userData?: User[];
  orgData?: Organization[];
  onRowClick?: (user: User | Organization) => void;
  onToggleStatus?: (orgId: string, newStatus: 'ACTIVE' | 'INACTIVE') => void;
}

const UserTable: React.FC<UserTableProps> = ({
  userData,
  orgData,
  onRowClick,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  const [localOrgs, setLocalOrgs] = useState<Organization[]>(orgData || []);
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingOrgId, setPendingOrgId] = useState<string | null>(null);
  const [pendingNewStatus, setPendingNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('INACTIVE');



  useEffect(() => {
    if (orgData) {
      setLocalOrgs(orgData);
      const initialStates: Record<string, boolean> = {};
      orgData.forEach(org => {
        initialStates[org.orgId] = org.orgStatus === 'ACTIVE';
      });
      setSwitchStates(initialStates);
    }
  }, [orgData]);


  const handleToggleClick = (checked: boolean, orgId: string) => {
    setPendingOrgId(orgId);
    setPendingNewStatus(checked ? 'ACTIVE' : 'INACTIVE');
    setConfirmModalOpen(true);
  };

 const confirmToggle = () => {
    if (pendingOrgId) {
      setSwitchStates(prev => ({
        ...prev,
        [pendingOrgId]: pendingNewStatus === 'ACTIVE'
      }));

      setLocalOrgs(prev =>
        prev.map(org =>
          org.orgId === pendingOrgId ? { ...org, orgStatus: pendingNewStatus } : org
        )
      );

      onToggleStatus?.(pendingOrgId, pendingNewStatus);
    }

    setConfirmModalOpen(false);
    setPendingOrgId(null);
  };

  const cancelToggle = () => {
    setConfirmModalOpen(false);
    setPendingOrgId(null);
  };



  const handleUserRowClick = (item: User | Organization) => {
    if (onRowClick) {
      onRowClick(item);
    } else {
      localStorage.setItem('orgId', item.orgId);
      localStorage.setItem('searchStr', item.orgId);
      navigate('/userbyid', { state: { orgId: item.orgId } });
    }
  };

  
  const handleOrgRowClick = (item: User | Organization) => {
    if (onRowClick) {
      onRowClick(item);
    } else {
      localStorage.setItem('orgId', item.orgId);
      localStorage.setItem('searchStr', item.orgId);
      navigate('/orgbyid', { state: { orgId: item.orgId } });
    }
  };

  const renderOrgRow = (row: Record<string, any>, rowIndex: number) => {
    const org = row as Organization;

    return (
      <TableRow
        key={rowIndex}
        onClick={() => handleOrgRowClick(org)}
        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100"
      >
        <TableCell className="px-6 py-4 text-start text-sm font-medium text-gray-900 hover:text-blue-600">
          {org.orgId}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
          {org.orgName}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700">
          <StatusBadge status={org.orgStatus} />
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700">
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              label=""
              color="blue"
              disabled={false}
              checked={switchStates[org.orgId] || false} 
              onChange={(checked) => handleToggleClick(checked, org.orgId)}
            />


          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderUserRow = (row: Record<string, any>, rowIndex: number) => {
    const user = row as User;

    return (
      <TableRow
        key={rowIndex}
        onClick={() => handleUserRowClick(user)}
        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-100"
      >
        <TableCell className="px-6 py-4 text-start text-sm font-medium text-gray-900 hover:text-blue-600">
          {user.orgId}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
          {user.companyName}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
          {user.companyEmail}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700 hover:text-blue-600">
          {user.companyPhone}
        </TableCell>
        <TableCell className="px-6 py-4 text-start text-sm text-gray-700">
          <StatusBadge status={user.status} />
        </TableCell>
      </TableRow>
    );
  };

  const isOrgData = orgData && orgData.length > 0;
  const dataToRender = isOrgData ? localOrgs : userData || [];

  return (
    <>
      <Table
        header={
          isOrgData
            ? ['Org ID', 'Org Name', 'Status', 'Action']
            : ['Org ID', 'Company Name', 'Email', 'Phone', 'Status']
        }
        data={dataToRender}
        renderRow={isOrgData ? renderOrgRow : renderUserRow}
        className="enhanced-table"
      />
      <ConfirmModal
        isOpen={confirmModalOpen}
        message={`Are you sure you want to ${pendingNewStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this organization?`}
        onCancel={cancelToggle}
        onConfirm={confirmToggle}
      />
    </>
  );
};

export default UserTable;
